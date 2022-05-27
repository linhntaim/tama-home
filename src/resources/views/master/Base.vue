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
import {mapActions, mapGetters} from 'vuex'

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
        ...mapGetters({
            accountIsLoggedIn: 'account/isLoggedIn',
        }),
        currentRouteName() {
            return this.$route.name
        },
    },
    methods: {
        ...mapActions({
            accountLogout: 'account/sanctumLogout',
        }),
        onLogoutClick() {
            this.accountLogout().then(() => this.$router.push({name: 'root'}))
        },
    },
}
</script>
