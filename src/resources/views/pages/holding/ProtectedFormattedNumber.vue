<template lang="pug">
span(v-if="protected") *****
formatted-number(v-else :value="value" :fractionDigits="fractionDigits")
</template>

<script>
import FormattedNumber from '@/resources/views/components/FormattedNumber'

export default {
    name: 'ProtectedFormattedNumber',
    components: {FormattedNumber},
    props: {
        value: Number,
        fractionDigits: {
            type: Number,
            default: 2,
        },
        protected: {
            type: Boolean,
            default: true,
        },
    },
}
</script>
