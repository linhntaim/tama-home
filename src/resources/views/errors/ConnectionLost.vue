<template lang="pug">
.internal-server-error
    h2 503 - Service Unavailable
    p Connection to server has been lost.
    button.btn.btn-primary(type="button" @click="onRefreshClick") Refresh
</template>

<script>
import {mapMutations} from 'vuex'

export default {
    name: 'ConnectionLost',
    methods: {
        onRefreshClick() {
            this.$router.push({name: 'root'})
        },
    },
}
</script>
