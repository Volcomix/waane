const html = String.raw;
const css = String.raw;

class WaaneElement extends HTMLElement {
  constructor() {
    super();
    this._setters = {};
    this._initShadowRoot();
    this._initAttributes();
  }

  attributeChangedCallback(name, _oldValue, newValue) {
    this[this._setters[name]] = newValue;
  }

  get _template() {
    return getTemplateElement.call(this, this.tagName)
  }

  get _attributes() {
    return getObservedAttributes.call(this, this.tagName)
  }

  _initShadowRoot() {
    const template = this._template;
    if (!template) return

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  _initAttributes() {
    const attributes = this._attributes;
    if (!attributes) return

    for (const attribute of attributes) {
      const property = toCamelCase(attribute);
      this._registerSetter(attribute, property);
      this._registerProperty(attribute, property);
    }
  }

  _registerSetter(attribute, property) {
    this._setters[attribute] = `_${property}`;
  }

  _registerProperty(attribute, property) {
    Object.defineProperty(this, property, {
      get() {
        return this.getAttribute(attribute)
      },
      set(value) {
        this.setAttribute(attribute, value);
      },
    });
  }
}

const getTemplateElement = memoize(function() {
  const styles = this.constructor.styles;
  const template = this.constructor.template;
  if (!styles && !template) {
    return null
  }
  const content = [];
  if (styles) {
    content.push(`<style>${styles}</style>`);
  }
  if (template) {
    content.push(template);
  }
  const templateElement = document.createElement('template');
  templateElement.innerHTML = content.join('');
  return templateElement
});

const getObservedAttributes = memoize(function() {
  return this.constructor.observedAttributes
});

const toCamelCase = memoize(function(string) {
  return string.toLowerCase().replace(/-(.)/g, (_match, p1) => p1.toUpperCase())
});

function memoize(fn) {
  const cache = {};
  return function(argument) {
    if (argument in cache) {
      return cache[argument]
    } else {
      return (cache[argument] = fn.call(this, argument))
    }
  }
}

var variables = css`
  --primary: var(--w-primary, 135, 203, 255);
  --secondary: var(--w-secondary, 246, 199, 126);
  --background: var(--w-background, 18, 18, 18);
  --surface: var(--w-surface, 18, 18, 18);

  --on-primary: var(--w-on-primary, 0, 0, 0);
  --on-secondary: var(--w-on-secondary, 0, 0, 0);
  --on-background: var(--w-on-background, 255, 255, 255);
  --on-surface: var(--w-on-surface, 255, 255, 255);

  --surface-opacity: var(--w-surface-opacity, 0.87);

  /* Set to none to disable (e.g. to remove the overlay on light theme) */
  --shadow: var(--w-shadow);
  --overlay: var(--w-overlay);

  --typeface: var(--w-typeface, 'Roboto', sans-serif);

  --font-light: var(--w-font-light, 300);
  --font-regular: var(--w-font-regular, 400);
  --font-medium: var(--w-font-medium, 500);

  --high-emphasis: var(--w-high-emphasis, 0.87);
  --medium-emphasis: var(--w-medium-emphasis, 0.6);
  --disabled: var(--w-disabled, 0.38);

  --shadow-color: var(--w-shadow-color, 0, 0, 0);
  --umbra-opacity: var(--w-umbra-opacity, 0.2);
  --penumbra-opacity: var(--w-penumbra-opacity, 0.14);
  --ambient-opacity: var(--w-ambient-opacity, 0.12);
`;

class NodeEditor extends WaaneElement {
  static get styles() {
    return css`
      :host {
        ${variables}
        position: relative;
        display: block;
        background-color: rgb(var(--background));
      }
    `
  }

  static get template() {
    return html`
      <slot></slot>
    `
  }

  constructor() {
    super();
    this._sockets = new Map();
    this._childListObserver = new MutationObserver(
      this._onChildListChange.bind(this),
    );
    this._nodesPositionObserver = new MutationObserver(
      this._onNodesPositionChange.bind(this),
    );
    this._linksSocketObserver = new MutationObserver(
      this._onLinksSocketChange.bind(this),
    );
    this.addEventListener('w-node-resize', this._onNodeResize.bind(this));
  }

  async connectedCallback() {
    this._childListObserver.observe(this, {
      childList: true,
      subtree: true,
    });
    this._nodesPositionObserver.observe(this, {
      attributeFilter: ['x', 'y'],
      subtree: true,
    });
    this._linksSocketObserver.observe(this, {
      attributeFilter: ['from', 'to'],
      subtree: true,
    });
    await customElements.whenDefined('w-node');
    await customElements.whenDefined('w-link');
    this.drawLinks();
  }

  disconnectedCallback() {
    this._childListObserver.disconnect();
    this._nodesPositionObserver.disconnect();
    this._linksSocketObserver.disconnect();
  }

  get nodes() {
    return this.querySelectorAll('w-node')
  }

  get links() {
    return this.querySelectorAll('w-link')
  }

  drawLinks() {
    const outputs = new Set();
    const inputs = new Set();
    this.nodes.forEach(node => {
      this._findUpdatedSockets(node, outputs, inputs);
    });
    this._updateLinks(outputs, inputs);
  }

  _onChildListChange(mutations) {
    const outputs = new Set();
    const inputs = new Set();
    mutations.forEach(mutation => {
      mutation.addedNodes.forEach(child => {
        if (this._isNode(child)) {
          this._findUpdatedSockets(child, outputs, inputs);
        }
        if (this._isLink(child)) {
          this._findLinkedSockets(child, outputs, inputs);
        }
      });
      mutation.removedNodes.forEach(child => {
        if (this._isNode(child)) {
          this._findRemovedSockets(child, outputs, inputs);
        }
      });
    });
    this._updateLinks(outputs, inputs);
  }

  _onNodesPositionChange(mutations) {
    const outputs = new Set();
    const inputs = new Set();
    mutations.forEach(mutation => {
      if (this._isNode(mutation.target)) {
        this._findUpdatedSockets(mutation.target, outputs, inputs);
      }
    });
    this._updateLinks(outputs, inputs);
  }

  _onLinksSocketChange(mutations) {
    const outputs = new Set();
    const inputs = new Set();
    mutations.forEach(mutation => {
      if (this._isLink(mutation.target)) {
        this._findLinkedSockets(mutation.target, outputs, inputs);
      }
    });
    this._updateLinks(outputs, inputs);
  }

  _onNodeResize(event) {
    const outputs = new Set();
    const inputs = new Set();
    this._findUpdatedSockets(event.target, outputs, inputs);
    this._updateLinks(outputs, inputs);
  }

  _isNode(target) {
    return target.nodeName.toLowerCase() === 'w-node'
  }

  _isLink(target) {
    return target.nodeName.toLowerCase() === 'w-link'
  }

  _findUpdatedSockets(target, outputs, inputs) {
    let sockets = this._sockets.get(target);
    if (sockets) {
      sockets.outputs.forEach(output => outputs.add(output));
      sockets.inputs.forEach(input => inputs.add(input));
    }
    sockets = { outputs: [], inputs: [] };
    target.outputs.forEach(output => {
      sockets.outputs.push(output.id);
      outputs.add(output.id);
    });
    target.inputs.forEach(input => {
      sockets.inputs.push(input.id);
      inputs.add(input.id);
    });
    this._sockets.set(target, sockets);
  }

  _findRemovedSockets(target, outputs, inputs) {
    target.outputs.forEach(output => outputs.add(output.id));
    target.inputs.forEach(input => inputs.add(input.id));
    this._sockets.delete(target);
  }

  _findLinkedSockets(link, outputs, inputs) {
    outputs.add(link.from);
    inputs.add(link.to);
  }

  _updateLinks(outputs, inputs) {
    const nodeEditorRect = this.getBoundingClientRect();
    this.links.forEach(link => {
      if (outputs.has(link.from) || inputs.has(link.to)) {
        this._updateLink(link, nodeEditorRect);
      }
    });
  }

  _updateLink(link, nodeEditorRect) {
    const fromPosition = this._getFromPosition(link, nodeEditorRect);
    const toPosition = this._getToPosition(link, nodeEditorRect);
    link.update(fromPosition, toPosition);
  }

  _getFromPosition(link, nodeEditorRect) {
    const from = this.querySelector(`w-output#${link.from}`);
    if (!from) return

    const fromRect = from.getBoundingClientRect();
    return {
      x: fromRect.x + fromRect.width - nodeEditorRect.x,
      y: fromRect.y + fromRect.height / 2 - nodeEditorRect.y,
    }
  }

  _getToPosition(link, nodeEditorRect) {
    const to = this.querySelector(`w-input#${link.to}`);
    if (!to) return

    const toRect = to.getBoundingClientRect();
    return {
      x: toRect.x - nodeEditorRect.x,
      y: toRect.y + toRect.height / 2 - nodeEditorRect.y,
    }
  }
}

customElements.define('w-node-editor', NodeEditor);

const layers = {
  umbra: [
    '0px 0px 0px 0px',
    '0px 2px 1px -1px',
    '0px 3px 1px -2px',
    '0px 3px 3px -2px',
    '0px 2px 4px -1px',
    '0px 3px 5px -1px',
    '0px 3px 5px -1px',
    '0px 4px 5px -2px',
    '0px 5px 5px -3px',
    '0px 5px 6px -3px',
    '0px 6px 6px -3px',
    '0px 6px 7px -4px',
    '0px 7px 8px -4px',
    '0px 7px 8px -4px',
    '0px 7px 9px -4px',
    '0px 8px 9px -5px',
    '0px 8px 10px -5px',
    '0px 8px 11px -5px',
    '0px 9px 11px -5px',
    '0px 9px 12px -6px',
    '0px 10px 13px -6px',
    '0px 10px 13px -6px',
    '0px 10px 14px -6px',
    '0px 11px 14px -7px',
    '0px 11px 15px -7px',
  ],
  penumbra: [
    '0px 0px 0px 0px',
    '0px 1px 1px 0px',
    '0px 2px 2px 0px',
    '0px 3px 4px 0px',
    '0px 4px 5px 0px',
    '0px 5px 8px 0px',
    '0px 6px 10px 0px',
    '0px 7px 10px 1px',
    '0px 8px 10px 1px',
    '0px 9px 12px 1px',
    '0px 10px 14px 1px',
    '0px 11px 15px 1px',
    '0px 12px 17px 2px',
    '0px 13px 19px 2px',
    '0px 14px 21px 2px',
    '0px 15px 22px 2px',
    '0px 16px 24px 2px',
    '0px 17px 26px 2px',
    '0px 18px 28px 2px',
    '0px 19px 29px 2px',
    '0px 20px 31px 3px',
    '0px 21px 33px 3px',
    '0px 22px 35px 3px',
    '0px 23px 36px 3px',
    '0px 24px 38px 3px',
  ],
  ambient: [
    '0px 0px 0px 0px',
    '0px 1px 3px 0px',
    '0px 1px 5px 0px',
    '0px 1px 8px 0px',
    '0px 1px 10px 0px',
    '0px 1px 14px 0px',
    '0px 1px 18px 0px',
    '0px 2px 16px 1px',
    '0px 3px 14px 2px',
    '0px 3px 16px 2px',
    '0px 4px 18px 3px',
    '0px 4px 20px 3px',
    '0px 5px 22px 4px',
    '0px 5px 24px 4px',
    '0px 5px 26px 4px',
    '0px 6px 28px 5px',
    '0px 6px 30px 5px',
    '0px 6px 32px 5px',
    '0px 7px 34px 6px',
    '0px 7px 36px 6px',
    '0px 8px 38px 7px',
    '0px 8px 40px 7px',
    '0px 8px 42px 7px',
    '0px 9px 44px 8px',
    '0px 9px 46px 8px',
  ],
};

function shadow(z) {
  return ['umbra', 'penumbra', 'ambient']
    .map(layerName => {
      const shadowProperties = layers[layerName][z];
      const shadowColor = `rgba(var(--shadow-color), var(--${layerName}-opacity))`;
      return `${shadowProperties} ${shadowColor}`
    })
    .join(', ')
}

function overlay(z) {
  const overlayOpacity = z === 0 ? 0 : Math.round(4.5 * Math.log1p(z) + 2) / 100;
  const overlayColor = `rgba(var(--on-surface), ${overlayOpacity})`;
  return `linear-gradient(${overlayColor}, ${overlayColor})`
}

function elevation(z) {
  return css`
    z-index: ${z};
    box-shadow: var(--shadow, ${shadow(z)});
    background-image: var(--overlay, ${overlay(z)});
  `
}

const typeface = 'var(--typeface)';
const light = `var(--font-light)`;
const regular = `var(--font-regular)`;
const medium = `var(--font-medium)`;

const typescale = {
  headline1: [light, 96, null, -1.5],
  headline2: [light, 60, null, -0.5],
  headline3: [regular, 48, null, 0],
  headline4: [regular, 34, null, 0.25],
  headline5: [regular, 24, null, 0],
  headline6: [medium, 20, null, 0.15],
  subtitle1: [regular, 16, null, 0.15],
  subtitle2: [medium, 14, null, 0.1],
  body1: [regular, 16, null, 0.5],
  body2: [regular, 14, null, 0.25],
  button: [medium, 14, 'uppercase', 1.25],
  caption: [regular, 12, null, 0.4],
  overline: [regular, 10, 'uppercase', 1.5],
};

function typography(name) {
  const [font, size, textTransform, letterSpacing] = typescale[name];
  return css`
    font-size: ${size}px;
    font-family: ${typeface};
    font-weight: ${font};
    text-transform: ${textTransform || 'none'};
    letter-spacing: ${letterSpacing}px;
  `
}

class Node extends WaaneElement {
    static get styles() {
      return `
  :host {
    position: absolute;
    border-radius: 4px;
    padding: 8px 12px;
    background-color: rgba(var(--surface), var(--surface-opacity));
    ${elevation(3)}
  }

  .title {
    color: rgba(var(--on-surface), var(--high-emphasis));
    ${typography('subtitle2')}
  }

  .body {
    display: flex;
    flex-direction: column;
    color: rgba(var(--on-surface), var(--medium-emphasis));
    ${typography('body2')}
  }

  .body::slotted(*) {
    min-height: 28px;
  }
`   }

    static get template() {
      return `
  <slot class="title" name="title">Node</slot>
  <slot class="body"></slot>
`   }

    static get observedAttributes() {
      return ['x', 'y']
    }

    constructor() {
      super();
      this._resizeObserver = new MutationObserver(
        this._dispatchResize.bind(this),
      );
    }

    connectedCallback() {
      this._resizeObserver.observe(this, {
        attributes: true,
        childList: true,
        characterData: true,
        subtree: true,
      });
    }

    disconnectedCallback() {
      this._resizeObserver.disconnect();
    }

    get outputs() {
      return this.querySelectorAll('w-output')
    }

    get inputs() {
      return this.querySelectorAll('w-input')
    }

    set _x(x) {
      this.style.left = x === null ? null : `${x}px`;
    }

    set _y(y) {
      this.style.top = y === null ? null : `${y}px`;
    }

    _dispatchResize(mutations) {
      if (this._isResized(mutations)) {
        this.dispatchEvent(new Event('w-node-resize', { bubbles: true }));
      }
    }

    _isResized(mutations) {
      return mutations.some(mutation => {
        return mutation.target !== this || mutation.type !== 'attributes'
      })
    }
  }

  customElements.define('w-node', Node);

class Link extends WaaneElement {
  static get styles() {
    return css`
      :host {
        position: absolute;
        display: block;
        min-width: 20px;
        min-height: 20px;
      }

      .link {
        width: 100%;
        height: 100%;
        overflow: visible;
        fill: none;
        stroke: rgba(var(--on-background), var(--medium-emphasis));
      }
    `
  }

  static get template() {
    return html`
      <svg class="link">
        <path />
      </svg>
    `
  }

  static get observedAttributes() {
    return ['from', 'to']
  }

  constructor() {
    super();
    this._path = this.shadowRoot.querySelector('path');
  }

  update(fromPosition, toPosition) {
    const { width, height } = this._updateBoundingBox(fromPosition, toPosition);
    this._updatePath(fromPosition, toPosition, width, height);
  }

  _updateBoundingBox(fromPosition, toPosition) {
    if (fromPosition && toPosition) {
      const width = Math.abs(toPosition.x - fromPosition.x);
      const height = Math.abs(toPosition.y - fromPosition.y);

      this.style.left = `${Math.min(fromPosition.x, toPosition.x)}px`;
      this.style.top = `${Math.min(fromPosition.y, toPosition.y)}px`;
      this.style.width = `${width}px`;
      this.style.height = `${height}px`;

      return { width, height }
    } else {
      this.style.left = null;
      this.style.top = null;
      this.style.width = null;
      this.style.height = null;
      return {}
    }
  }

  _updatePath(fromPosition, toPosition, width, height) {
    if (fromPosition && toPosition) {
      const start = {
        x: toPosition.x > fromPosition.x ? 0 : width,
        y: toPosition.y > fromPosition.y ? 0 : height,
      };
      const end = {
        x: toPosition.x > fromPosition.x ? width : 0,
        y: toPosition.y > fromPosition.y ? height : 0,
      };
      const startControlPoint = {
        x: start.x + width * 0.5,
        y: start.y,
      };
      const endControlPoint = {
        x: end.x - width * 0.5,
        y: end.y,
      };
      this._path.setAttribute(
        'd',
        [
          `M ${start.x},${start.y}`,
          `C ${startControlPoint.x},${startControlPoint.y}`,
          `${endControlPoint.x},${endControlPoint.y}`,
          `${end.x},${end.y}`,
        ].join(' '),
      );
    } else {
      this._path.removeAttribute('d');
    }
  }
}

customElements.define('w-link', Link);

class Output extends WaaneElement {
  static get styles() {
    return css`
      :host {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        margin-right: -12px;
      }

      :host::after {
        content: '';
        margin-left: 8px;
        margin-right: -4px;
        border-radius: 4px;
        width: 8px;
        height: 8px;
        background-color: rgb(var(--secondary));
      }
    `
  }

  static get template() {
    return html`
      <slot>Output</slot>
    `
  }
}

customElements.define('w-output', Output);

class Input extends WaaneElement {
  static get styles() {
    return css`
      :host {
        display: flex;
        align-items: center;
        margin-left: -12px;
      }

      :host::before {
        content: '';
        margin-left: -4px;
        margin-right: 8px;
        border-radius: 4px;
        width: 8px;
        height: 8px;
        background-color: rgb(var(--secondary));
      }
    `
  }

  static get template() {
    return html`
      <slot>Input</slot>
    `
  }
}

customElements.define('w-input', Input);
