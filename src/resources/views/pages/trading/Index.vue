<template lang="pug">
form.row.row-cols-lg-auto.g-3.align-items-center(@submit.prevent="onSubmit" method="post")
    .col-12
        label.visually-hidden(for="inputExchange") Exchange
        select#inputExchange.form-select(v-model="exchange" @change="onExchangeChange")
            option(v-for="value in exchanges" :key="value.id" :value="value.id" :selected="exchange === value.id")
                | {{ value.name }}
    .col-12
        label.visually-hidden(for="inputTicker") Ticker
        select#inputTicker.form-select(v-model="ticker")
            option(v-for="value in tickers" :key="value" :value="value") {{ value }}
    .col-12
        label.visually-hidden(for="inputInterval") Interval
        select#inputInterval.form-select(v-model="interval")
            option(v-for="value in intervals" :key="value" :value="value") {{ value }}
    .col-12
        label.visually-hidden(for="inputIndicator") Indicator
        select#inputIndicator.form-select(v-model="indicator" @change="onExchangeChange")
            option(v-for="value in indicators" :key="value.id" :value="value.id" :selected="indicator === value.id")
                | {{ value.name }}
    .col-12
        button.btn.btn-primary(type="submit" :disabled="loading._") Submit
.mt-3.table-responsive
    component(v-if="swingTrades.length" :is="tableComponent" :swingTrades="swingTrades")
    .py-5.text-center(v-else)
        span(v-if="fetched") No data has been retrieved.
        span(v-else) Please press the <strong>Submit</strong> button to retrieve the data.
</template>

<script>
import {defineAsyncComponent} from 'vue'
import {ucfirst} from 'locutus/php/strings'
import {ExchangeService} from '@/app/services/starter/exchange-service'
import {SwingTradeService} from '@/app/services/starter/swing-trade-service'
import {mapActions, mapGetters} from 'vuex'

const INDICATORS = [
    {
        id: 'rsi',
        name: 'RSI Indicator',
    },
]

export default {
    // eslint-disable-next-line
    name: 'Index',
    data() {
        return {
            loading: {
                _: false,
            },

            tickers: [],
            intervals: [],
            indicators: INDICATORS,

            exchange: null,
            ticker: null,
            interval: null,
            indicator: INDICATORS[0].id,

            fetched: false,
            swingTrades: [],

            tableComponent: null,
        }
    },
    computed: {
        ...mapGetters({
            exchanges: 'exchange/all',
        }),
        exchangeCacheKey() {
            return `exchange.${this.exchange}`
        },
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
            this.exchangeAll().then(async () => {
                this.exchange = this.exchanges.length ? this.exchanges[0].id : null
                this.loading._ = false
                await this.onExchangeChange()
                this.onIndicatorChange()
            })
        },
        async onExchangeChange() {
            if (this.exchange) {
                const exchange = await this.$cache.get(this.exchangeCacheKey)
                if (exchange) {
                    this.tickers = exchange.tickers
                    this.ticker = exchange.defaultTicker
                    this.intervals = exchange.intervals
                    this.interval = exchange.defaultInterval
                }
                else {
                    this.loading._ = true
                    Promise.all([
                        this.$service(ExchangeService)
                            .done(data => {
                                this.tickers = data.tickers
                                this.ticker = data.default
                            })
                            .tickerIndex(this.exchange),
                        this.$service(ExchangeService)
                            .done(data => {
                                this.intervals = data.intervals
                                this.interval = data.default
                            })
                            .intervalIndex(this.exchange),
                    ]).then(() => {
                        this.$cache.set(this.exchangeCacheKey, {
                            tickers: this.tickers,
                            defaultTicker: this.ticker,
                            intervals: this.intervals,
                            defaultInterval: this.interval,
                        })
                        this.loading._ = false
                    })
                }
            }
        },
        onIndicatorChange() {
            this.swingTrades = []
            this.tableComponent = defineAsyncComponent(() => import(`./${ucfirst(this.indicator)}Table`))
        },
        onSubmit() {
            this.loading._ = true
            this.$service(SwingTradeService)
                .done(data => {
                    this.swingTrades = data.swing_trades
                    this.fetched = true
                })
                .always(() => this.loading._ = false)
                .swing(this.exchange, this.indicator, this.ticker, this.interval)
        },
    },
}
</script>
