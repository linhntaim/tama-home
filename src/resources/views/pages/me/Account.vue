<template lang="pug">
.account.text-center
    h2.mb-3 Account
    .text-black {{ accountName }}
    .text-black-50.small {{ accountEmail }}
</template>

<script>
import {mapGetters} from 'vuex'

export default {
    // eslint-disable-next-line
    name: 'Account',
    computed: {
        ...mapGetters({
            account: 'account/account',
        }),
        accountName() {
            return this.account?.name
        },
        accountEmail() {
            return this.account?.email
        },
    },
}
</script>
