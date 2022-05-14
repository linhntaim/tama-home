<template lang="pug">
form.row.row-cols-lg-auto.g-3.align-items-center(@submit.prevent="onSubmit" method="post")
    .col-12
        label.visually-hidden(for="inputExchange") Exchange
        select#inputExchange.form-select(v-model="exchange")
            option(v-for="item in exchanges" :key="item.id" :value="item.id") {{ item.name }}
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
            option(v-for="value in indicators" :key="value.id" :value="value.id") {{ value.name }}
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
    // eslint-disable-next-line
    name: 'Trading',
    data() {
        return {
            loading: {
                _: false,
            },

            exchanges: [],
            symbols: [],
            intervals: [],
            indicators: [
                {
                    id: 'rsi',
                    name: 'RSI Indicator',
                },
            ],

            exchange: null,
            symbol: null,
            interval: null,
            indicator: 'rsi',

            swingTrades: [],
        }
    },
    computed: {
        exchangeCacheKey() {
            return `exchange.${this.exchange}`
        },
    },
    created() {
        this.loading._ = true
        this.$service(ExchangeService)
            .done(data => {
                this.exchanges = data.exchanges
                this.exchange = data.exchanges.length ? data.exchanges[0].id : null
                this.loading._ = false
                this.onExchangeChange()
            })
            .index()
    },
    methods: {
        onExchangeChange() {
            if (this.exchange) {
                const exchange = this.$cache.get(this.exchangeCacheKey)
                if (exchange) {
                    this.symbols = exchange.symbols
                    this.symbol = exchange.defaultSymbol
                    this.intervals = exchange.intervals
                    this.interval = exchange.defaultInterval
                }
                else {
                    this.loading._ = true
                    Promise.all([
                        this.$service(ExchangeService)
                            .done(data => {
                                this.symbols = data.symbols
                                this.symbol = data.default
                            })
                            .symbolIndex(this.exchange),
                        this.$service(ExchangeService)
                            .done(data => {
                                this.intervals = data.intervals
                                this.interval = data.default
                            })
                            .intervalIndex(this.exchange),
                    ]).then(() => {
                        this.$cache.set(this.exchangeCacheKey, {
                            symbols: this.symbols,
                            defaultSymbol: this.symbol,
                            intervals: this.intervals,
                            defaultInterval: this.interval,
                        })
                        this.loading._ = false
                    })
                }
            }
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
