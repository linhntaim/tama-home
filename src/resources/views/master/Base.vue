<template lang="pug">
.container
    header.my-5.text-center
        h1.display-4.fw-bold
            .text-black
                img.me-2.rounded-1.align-baseline(:src="appUrl + '/img/logo-32x32.png'" alt="Logo")
                | {{ appName }}
            .lead {{ appDescription }}
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
import {mapGetters, mapMutations} from 'vuex'

export default {
    // eslint-disable-next-line
    name: 'Base',
    data() {
        return {
            appUrl: this.$config.app.url,
            appName: this.$config.app.name,
            appDescription: this.$config.app.description,
            loginRoute: this.$config.app.routes.login,
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
                items.push({
                    label: 'Account',
                    to: {
                        name: 'account',
                    },
                })
            }
            else {
                items.push(
                    {
                        label: 'Login',
                        to: this.loginRoute,
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
        ...mapMutations({
            accountActivateLogout: 'account/activateLogout',
        }),
        onLogoutClick() {
            this.accountActivateLogout()
            this.$router.push(this.$config.app.routes.logout)
        },
    },
}
</script>

<style lang="scss" scoped>
@media (max-width: 575.98px) {
    h1 img {
        width: 22px;
    }
}

@media (min-width: 576px) and (max-width: 767.98px) {
    h1 img {
        width: 26px;
    }
}

@media (min-width: 768px) and (max-width: 991.98px) {
    h1 img {
        width: 30px;
    }
}

h1 img {

}
</style>