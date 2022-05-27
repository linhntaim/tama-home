<template lang="pug">
.container
    h1.text-center.my-5 {{ appName }}
    .card
        .card-header
            ul.nav.nav-tabs.card-header-tabs
                li.nav-item(v-for="item in menuItems")
                    router-link.nav-link(:class="{active: currentRouteName === item.to.name}" :to="item.to") {{ item.label }}
                li.nav-item(v-if="accountIsLoggedIn")
                    a.nav-link(@click.prevent="onLogoutClick" href="#") Logout
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
        menuItems() {
            const items = [
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
            ]
            if (this.accountIsLoggedIn) {
                // items.push()
            }
            else {
                items.push(
                    {
                        label: 'Login',
                        to: {
                            name: 'login',
                        },
                    },
                    {
                        label: 'Register',
                        to: {
                            name: 'register',
                        },
                    },
                    {
                        label: 'Forgot Password',
                        to: {
                            name: 'password.request',
                        },
                    },
                )
            }
            return items
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
