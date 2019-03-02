<template>
  <label class="number-field">
    <i class="arrow material-icons">arrow_left</i>
    <span class="label">{{ label }}</span
    >:<span class="value">{{ value }}</span>
    <i class="arrow material-icons">arrow_right</i>
    <input
      class="input body2"
      type="number"
      :min="singleFloatMin"
      :max="singleFloatMax"
      :step="step"
      v-model.number="validValue"
      @focus="$event.target.select()"
      @keydown.enter="$event.target.blur()"
      @keydown.stop
    />
  </label>
</template>

<script>
export default {
  name: 'NumberField',
  props: {
    label: String,
    min: Number,
    max: Number,
    value: Number,
  },
  computed: {
    singleFloatMin() {
      if (this.min > -3.4028234663852886e38) {
        return this.min
      }
      return null
    },
    singleFloatMax() {
      if (this.max < 3.4028234663852886e38) {
        return this.max
      }
      return null
    },
    step() {
      if (
        this.min >= -10 &&
        this.min <= 10 &&
        this.max >= -10 &&
        this.max <= 10
      ) {
        return 0.1
      }
      return null
    },
    validValue: {
      get() {
        return this.value
      },
      set(value) {
        if (value === '') {
          return
        }
        if (value < this.min) {
          value = this.min
        } else if (value > this.max) {
          value = this.max
        }
        this.$emit('input', value)
      },
    },
  },
}
</script>

<style scoped>
.number-field {
  position: relative;
  display: flex;
  white-space: nowrap;
}
.number-field:focus-within {
  color: transparent;
}
.label {
  flex-shrink: 1;
  overflow: hidden;
}
.value {
  flex-grow: 1;
  margin-left: 2px;
  text-align: right;
}
.arrow {
  color: rgba(var(--on-background), 0.2);
}
.number-field:focus-within .arrow {
  color: transparent;
}
.input {
  position: absolute;
  top: 0;
  left: 0;
  -moz-appearance: textfield;
  outline: none;
  border: none;
  border-radius: 4px;
  width: calc(100% - 16px);
  height: 100%;
  padding: 0 8px;
  background-color: rgba(var(--on-background), 0.04);
  cursor: default;
  color: transparent;
}
.input:hover {
  background-color: rgba(var(--on-background), 0.08);
}
.input::-webkit-inner-spin-button,
.input::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
.input:focus {
  cursor: auto;
  color: rgb(var(--on-background));
}
.input:not(:focus)::selection {
  background-color: transparent;
  color: transparent;
}
.number-field,
.arrow,
.input {
  transition: color 100ms var(--easing-standard);
}
</style>
