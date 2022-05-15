<template lang="pug">
span(v-if="protected") *****
formatted-number-input(
    v-else
    :modelValue="modelValue"
    @update:modelValue="onUpdateModelValue"
    :fractionDigits="fractionDigits"
    :textClass="textClass"
    :inputClass="inputClass"
    )
</template>

<script>
import FormattedNumberInput from '@/resources/views/components/FormattedNumberInput'

export default {
    name: 'ProtectedFormattedNumberInput',
    components: {FormattedNumberInput},
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
        protected: {
            type: Boolean,
            default: true,
        },
    },
    methods: {
        onUpdateModelValue(value) {
            this.$emit('update:modelValue', value)
        },
    },
}
</script>
