/**
 * @typedef {import("../helpers/file-helper.js").FileContent} FileContent
 */

export default /** @type {FileContent} */ (
  /** @type {unknown} */ ({
    nodeEditor: {
      zoom: '0.6289999999999997',
      'pan-x': '-449.7001009262679',
      'pan-y': '-253.46960258430437',
    },
    nodes: [
      {
        name: 'node-track',
        x: -1003.1595382890781,
        y: 17.526804905206035,
        attributes: {
          track: '1',
        },
        outputs: ['output-1'],
        inputs: [],
      },
      {
        name: 'node-schedule',
        x: -729,
        y: -541,
        attributes: {
          'start-time': '0.003',
          'time-constant': '0.06',
        },
        outputs: ['output-2'],
        inputs: ['input-1'],
      },
      {
        name: 'node-schedule',
        x: -727,
        y: -90,
        attributes: {
          'start-time': '0',
          'time-constant': '0.001',
          'target-value': '1',
        },
        outputs: ['output-3'],
        inputs: ['input-2'],
      },
      {
        name: 'node-constant',
        x: -372.60414325481185,
        y: -379.75106318595414,
        attributes: {
          offset: '0',
        },
        outputs: ['output-4'],
        inputs: ['input-3'],
      },
      {
        name: 'node-gain',
        x: 12.103986495540756,
        y: -216.77428701187904,
        attributes: {
          gain: '130',
        },
        outputs: ['output-5'],
        inputs: ['input-4', 'input-5'],
      },
      {
        name: 'node-oscillator',
        x: 356.65354866465316,
        y: -265.22661408843317,
        attributes: {
          type: 'sine',
          frequency: '0',
          detune: '0',
        },
        outputs: ['output-6'],
        inputs: ['input-6', 'input-7'],
      },
      {
        name: 'node-biquad-filter',
        x: 726.9356424947939,
        y: -371.6694446525491,
        attributes: {
          type: 'lowpass',
          frequency: '300',
          detune: '0',
          q: '20',
          gain: '0',
        },
        outputs: ['output-7'],
        inputs: ['input-8', 'input-9', 'input-10', 'input-11', 'input-12'],
      },
      {
        name: 'node-gain',
        x: 1095.6431254879901,
        y: -84.59461472057603,
        attributes: {
          gain: '1',
        },
        outputs: ['output-8'],
        inputs: ['input-13', 'input-14'],
      },
      {
        name: 'node-gain',
        x: 1595.5793906250203,
        y: -678.7856372098778,
        attributes: {
          gain: '0',
        },
        outputs: ['output-9'],
        inputs: ['input-15', 'input-16'],
      },
      {
        name: 'node-audio-destination',
        x: 1928.046450106558,
        y: -607.2777223804663,
        attributes: {},
        outputs: [],
        inputs: ['input-17'],
      },
      {
        name: 'node-schedule',
        x: -725.8203497615269,
        y: 368.37996820349827,
        attributes: {
          'start-time': '0.003',
          'time-constant': '0.001',
        },
        outputs: ['output-10'],
        inputs: ['input-18'],
      },
      {
        name: 'node-constant',
        x: -367.8346678971009,
        y: 78.11857115426857,
        attributes: {
          offset: '0',
        },
        outputs: ['output-11'],
        inputs: ['input-19'],
      },
      {
        name: 'node-oscillator',
        x: -725.6398685940358,
        y: 827.3642422564245,
        attributes: {
          type: 'triangle',
          frequency: '66',
          detune: '0',
        },
        outputs: ['output-12'],
        inputs: ['input-20', 'input-21'],
      },
      {
        name: 'node-gain',
        x: -363.9760363944888,
        y: 828.0161696940673,
        attributes: {
          gain: '500',
        },
        outputs: ['output-13'],
        inputs: ['input-22', 'input-23'],
      },
      {
        name: 'node-oscillator',
        x: 8.813079251769526,
        y: 785.8392989457668,
        attributes: {
          type: 'triangle',
          frequency: '40',
          detune: '0',
        },
        outputs: ['output-14'],
        inputs: ['input-24', 'input-25'],
      },
      {
        name: 'node-biquad-filter',
        x: 363.19496449168616,
        y: 561.4241560483201,
        attributes: {
          type: 'highpass',
          frequency: '40',
          detune: '0',
          q: '30',
          gain: '0',
        },
        outputs: ['output-15'],
        inputs: ['input-26', 'input-27', 'input-28', 'input-29', 'input-30'],
      },
      {
        name: 'node-biquad-filter',
        x: 728.4019181546178,
        y: 235.36867851460656,
        attributes: {
          type: 'lowpass',
          frequency: '130',
          detune: '0',
          q: '30',
          gain: '0',
        },
        outputs: ['output-16'],
        inputs: ['input-31', 'input-32', 'input-33', 'input-34', 'input-35'],
      },
      {
        name: 'node-gain',
        x: 365.4764205131359,
        y: 237.77116753357572,
        attributes: {
          gain: '5000',
        },
        outputs: ['output-17'],
        inputs: ['input-36', 'input-37'],
      },
      {
        name: 'node-gain',
        x: 1095.6431254879903,
        y: 240.9185817603625,
        attributes: {
          gain: '0.2',
        },
        outputs: ['output-18'],
        inputs: ['input-38', 'input-39'],
      },
    ],
    links: [
      {
        from: 'output-1',
        to: 'input-1',
      },
      {
        from: 'output-1',
        to: 'input-2',
      },
      {
        from: 'output-2',
        to: 'input-3',
      },
      {
        from: 'output-3',
        to: 'input-3',
      },
      {
        from: 'output-4',
        to: 'input-5',
      },
      {
        from: 'output-5',
        to: 'input-6',
      },
      {
        from: 'output-6',
        to: 'input-12',
      },
      {
        from: 'output-4',
        to: 'input-15',
      },
      {
        from: 'output-8',
        to: 'input-16',
      },
      {
        from: 'output-1',
        to: 'input-18',
      },
      {
        from: 'output-3',
        to: 'input-19',
      },
      {
        from: 'output-10',
        to: 'input-19',
      },
      {
        from: 'output-12',
        to: 'input-23',
      },
      {
        from: 'output-13',
        to: 'input-24',
      },
      {
        from: 'output-14',
        to: 'input-30',
      },
      {
        from: 'output-15',
        to: 'input-35',
      },
      {
        from: 'output-11',
        to: 'input-37',
      },
      {
        from: 'output-18',
        to: 'input-16',
      },
      {
        from: 'output-16',
        to: 'input-39',
      },
      {
        from: 'output-17',
        to: 'input-31',
      },
      {
        from: 'output-7',
        to: 'input-14',
      },
      {
        from: 'output-9',
        to: 'input-17',
      },
    ],
    tracks: [
      {
        label: '1',
        effects: {
          0: 'FF',
          2: 'FF',
          3: 'FF',
          6: 'FF',
          7: 'FF',
          9: 'FF',
          10: 'FF',
          11: 'FF',
          13: 'FF',
          14: 'FF',
        },
      },
    ],
  })
)
