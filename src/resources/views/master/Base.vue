<template lang="pug">
.container
    h1.text-center.my-5 {{ appName }}
    .card
        .card-header
            ul.nav.nav-tabs.card-header-tabs
                li.nav-item
                    router-link.nav-link(:class="{active: currentRouteName === 'trading'}" :to="{name: 'trading'}") Trading
                li.nav-item
                    router-link.nav-link(:class="{active: currentRouteName === 'holding'}" :to="{name: 'holding'}") Holding
        .card-body
            router-view
</template>

<script>
export default {
    // eslint-disable-next-line
    name: 'Base',
    data() {
        return {
            appName: this.$config.app.name,
        }
    },
    computed: {
        currentRouteName() {
            return this.$route.name
        },
    },
}
</script>
