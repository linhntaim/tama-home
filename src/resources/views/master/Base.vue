<template lang="pug">
.container
    h1.text-center.my-5 {{ appName }}
    .card
        .card-header
            ul.nav.nav-tabs.card-header-tabs
                li.nav-item(v-for="item in menu")
                    router-link.nav-link(:class="{active: currentRouteName === item.to.name}" :to="item.to") {{ item.label }}
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

            menu: [
                {
                    label: 'Holding',
                    to: {
                        name: 'holding',
                    },
                },
                {
                    label: 'Trading',
                    to: {
                        name: 'trading',
                    },
                },
            ],
        }
    },
    computed: {
        currentRouteName() {
            return this.$route.name
        },
    },
}
</script>
