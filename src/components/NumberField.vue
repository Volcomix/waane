<template>
  <label class="number-field">
    <span class="label">{{ label }}</span
    >:<span class="value">{{ value }}</span>
    <input class="input body2" type="number" :value="value" v-on="listeners" />
  </label>
</template>

<script>
export default {
  name: 'NumberField',
  props: {
    label: String,
    value: Number,
  },
  computed: {
    listeners() {
      return {
        ...this.$listeners,
        focus: event => {
          event.target.select()
        },
        input: event => {
          this.$emit('input', event.target.value)
        },
      }
    },
  },
}
</script>

<style scoped>
.number-field {
  position: relative;
  display: flex;
  padding: 0 8px;
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
  color: transparent;
}
.input::-webkit-inner-spin-button,
.input::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
.input:focus {
  color: rgb(var(--on-background));
}
.input:not(:focus)::selection {
  background-color: transparent;
}
.number-field,
.input {
  transition: color 100ms var(--easing-standard);
}
</style>
