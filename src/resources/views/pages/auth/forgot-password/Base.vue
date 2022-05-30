<template lang="pug">
router-view.text-center
</template>

<script>
import {mapMutations} from 'vuex'

export default {
    // eslint-disable-next-line
    name: 'Base',
    beforeUnmount() {
        this.forgotPasswordSetProgressing(false)
        this.forgotPasswordReset()
    },
    methods: {
        ...mapMutations({
            forgotPasswordSetProgressing: 'forgotPassword/setProgressing',
            forgotPasswordReset: 'forgotPassword/reset',
        }),
    },
}
</script>
