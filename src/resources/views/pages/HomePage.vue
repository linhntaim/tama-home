<template lang="pug">
.container
    h1.text-center.my-5 Crypto Trading
    .card
        .card-body
            form.row.row-cols-lg-auto.g-3.align-items-center(@submit.prevent="onSubmit" method="post")
                .col-12
                    label.visually-hidden(for="inputExchange") Exchange
                    select.form-select(id="inputExchange" v-model="exchange")
                        option(v-for="(text, value) in exchanges" :key="value" :value="value") {{ text }}
                .col-12
                    label.visually-hidden(for="inputSymbol") Symbol
                    select.form-select(id="inputSymbol" v-model="symbol")
                        option(v-for="value in symbols" :key="value" :value="value") {{ value }}
                .col-12
                    label.visually-hidden(for="inputInterval") Interval
                    select.form-select(id="inputInterval" v-model="interval")
                        option(v-for="value in intervals" :key="value" :value="value") {{ value }}
                .col-12
                    label.visually-hidden(for="inputIndicator") Indicator
                    select.form-select(id="inputIndicator" v-model="indicator")
                        option(v-for="(text, value) in indicators" :key="value" :value="value") {{ text }}
                .col-12
                    button.btn.btn-primary(type="submit" :disabled="loading._") Submit
            pre.bg-light.mt-3.p-3
                code {{ swingTrades }}
</template>

<script>
import {ExchangeService} from '@/app/services/exchange-service'
import {SwingTradeService} from '@/app/services/swing-trade-service'

export default {
    name: 'HomePage',
    data() {
        return {
            loading: {
                _: false,
            },

            symbols: [],
            intervals: [],
            exchanges: {
                binance: 'Binance',
            },
            indicators: {
                rsi: 'RSI Indicator',
            },

            exchange: 'binance',
            symbol: 'BTCUSDT',
            interval: '1d',
            indicator: 'rsi',

            swingTrades: [],
        }
    },
    created() {
        this.onExchangeChange()
    },
    methods: {
        onExchangeChange() {
            this.loading._ = true
            Promise.all([
                this.$service(ExchangeService)
                    .done(data => this.symbols = data.symbols)
                    .symbolIndex(this.exchange),
                this.$service(ExchangeService)
                    .done(data => this.intervals = data.intervals)
                    .intervalIndex(this.exchange),
            ]).then(() => this.loading._ = false)
        },
        onSubmit() {
            this.loading._ = true
            this.$service(SwingTradeService)
                .done(data => {
                    this.swingTrades = data.swing_trades
                })
                .always(() => this.loading._ = false)
                .swing(this.exchange, this.indicator, this.symbol, this.interval)
        },
    },
}
</script>

<style scoped>

</style>