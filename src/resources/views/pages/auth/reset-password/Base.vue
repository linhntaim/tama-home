<template lang="pug">
router-view.text-center
</template>

<script>
import {mapMutations} from 'vuex'

export default {
    // eslint-disable-next-line
    name: 'Base',
    beforeUnmount() {
        this.resetPasswordSetProgressing(false)
        this.resetPasswordReset()
    },
    methods: {
        ...mapMutations({
            resetPasswordSetProgressing: 'resetPassword/setProgressing',
            resetPasswordReset: 'resetPassword/reset',
        }),
    },
}
</script>
