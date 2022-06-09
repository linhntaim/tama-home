<template lang="pug">
.account.text-center
    h2.mb-3 Account
    .text-black {{ account.name }}
    .text-black-50.small {{ account.email }}
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
    },
}
</script>
