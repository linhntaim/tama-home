<template lang="pug">
formatted-number(v-if="toggle" :class="textClass" :value="modelValue" :fractionDigits="fractionDigits" @click="onToggle")
input(v-else ref="numberInput" :class="inputClass" :value="input" type="text" @focus="onFocus" @blur="onBlur" @keyup.enter="onPressEnterKey" @keyup.esc="onPressEscapeKey")
</template>

<script>
import FormattedNumber from './FormattedNumber'

export default {
    name: 'FormattedNumberInput',
    components: {FormattedNumber},
    props: {
        modelValue: Number,
        fractionDigits: {
            type: Number,
            default: 2,
        },
        textClass: {
            type: String,
            default: '',
        },
        inputClass: {
            type: String,
            default: '',
        },
    },
    data() {
        return {
            input: this.modelValue,
            toggle: true,
        }
    },
    watch: {
        modelValue() {
            this.input = this.modelValue
        },
    },
    methods: {
        onToggle() {
            this.toggle = !this.toggle
            if (!this.toggle) {
                this.$nextTick(() => this.$refs.numberInput.focus())
            }
        },
        onInput($event) {
            const value = parseFloat($event.target.value)
            this.$emit('update:modelValue', value ? value : 0)
        },
        onBlur($event) {
            this.onInput($event)
            this.onToggle()
        },
        onFocus($event) {
            const value = $event.target.value
            if (/^0+$/.test(value)) {
                $event.target.setSelectionRange(0, value.length)
            }
        },
        onPressEnterKey() {
            this.$refs.numberInput.blur()
        },
        onPressEscapeKey() {
            this.input = this.modelValue
            this.$forceUpdate()
            this.$nextTick(() => this.$refs.numberInput.blur())
        },
    },
}
</script>
