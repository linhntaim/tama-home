<template lang="pug">
.container
    h1.text-center.my-5 Crypto Trading
    .card
        .card-body
            form.row.row-cols-lg-auto.g-3.align-items-center(@submit.prevent="onSubmit" method="post")
                .col-12
                    label.visually-hidden(for="inputExchange") Exchange
                    select#inputExchange.form-select(v-model="exchange")
                        option(v-for="(text, value) in exchanges" :key="value" :value="value") {{ text }}
                .col-12
                    label.visually-hidden(for="inputSymbol") Symbol
                    select#inputSymbol.form-select(v-model="symbol")
                        option(v-for="value in symbols" :key="value" :value="value") {{ value }}
                .col-12
                    label.visually-hidden(for="inputInterval") Interval
                    select#inputInterval.form-select(v-model="interval")
                        option(v-for="value in intervals" :key="value" :value="value") {{ value }}
                .col-12
                    label.visually-hidden(for="inputIndicator") Indicator
                    select#inputIndicator.form-select(v-model="indicator")
                        option(v-for="(text, value) in indicators" :key="value" :value="value") {{ text }}
                .col-12
                    button.btn.btn-primary(type="submit" :disabled="loading._") Submit
            .mt-3.table-responsive
                table.table.table-bordered
                    thead
                        tr
                            th.text-center.align-middle(rowspan="2") Action
                            th.text-center.align-middle(rowspan="2") Time
                            th.text-center.align-middle(rowspan="2") Price
                            th.text-center.align-middle(rowspan="2") Strength
                            th.text-center.align-middle(colspan="3") Divergence 1
                            th.text-center.align-middle(colspan="3") Divergence 2
                        tr
                            th.text-center Time
                            th.text-center Price
                            th.text-center RSI
                            th.text-center Time
                            th.text-center Price
                            th.text-center RSI
                    tbody
                        tr(v-for="swingTrade in swingTrades" )
                            td.text-center {{ swingTrade.buy ? 'Buy' : 'Sell'}}
                            td.text-center {{ swingTrade.time }}
                            td.text-end {{ swingTrade.price?.toFixed(2) }}
                            td.text-end {{ swingTrade.strength.toFixed(2) }}
                            td.text-center {{ swingTrade.divergence_1.time }}
                            td.text-end {{ swingTrade.divergence_1.price.toFixed(2) }}
                            td.text-end {{ swingTrade.divergence_1.rsi.toFixed(2) }}
                            td.text-center {{ swingTrade.divergence_2.time }}
                            td.text-end {{ swingTrade.divergence_2.price.toFixed(2) }}
                            td.text-end {{ swingTrade.divergence_2.rsi.toFixed(2) }}
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
