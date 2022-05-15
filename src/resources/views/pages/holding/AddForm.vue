<template lang="pug">
form.row.row-cols-lg-auto.g-3.align-items-center(@submit.prevent="onSubmit" method="post")
    .col-12
        label.visually-hidden(for="inputSymbol") Symbol
        input#inputSymbol.form-control(v-model="symbol" type="text" placeholder="BTC" required)
    .col-12
        label.visually-hidden(for="inputAmount") Amount
        input#inputAmount.form-control.text-end(v-model="amount" type="text" placeholder="0.00000000" required)
    .col-12
        label.visually-hidden(for="inputExchange") Exchange
        select#inputExchange.form-select(v-model="exchange" @change="onExchangeChange")
            option(v-for="value in exchanges" :key="value.id" :value="value.id" :selected="exchange === value.id")
                | {{ value.name }}
    .col-12
        button.btn.btn-primary(type="submit" :disabled="loading._") Add your asset
</template>

<script>
import {mapActions, mapGetters} from 'vuex'
import {floatval} from 'locutus/php/var'

export default {
    name: 'AddForm',
    data() {
        return {
            loading: {
                _: false,
            },

            symbol: '',
            amount: '0.00000000',
            exchange: null,
        }
    },
    computed: {
        ...mapGetters({
            exchanges: 'exchange/all',
        }),
    },
    created() {
        this.getAllExchanges()
    },
    methods: {
        ...mapActions({
            exchangeAll: 'exchange/all',
        }),
        getAllExchanges() {
            this.loading._ = true
            this.exchangeAll().then(() => {
                this.exchange = this.exchanges.length ? this.exchanges[0].id : null
                this.loading._ = false
            })
        },
        onSubmit() {
            this.$emit('add', {
                symbol: this.symbol.toUpperCase(),
                amount: (amount => amount >= 0 ? amount : 0)(floatval(this.amount)),
                exchange: this.exchange,
            })

            this.symbol = ''
            this.amount = '0.00000000'
            this.exchange = this.exchanges.length ? this.exchanges[0].id : null
        },
    },
}
</script>
