<template lang="pug">
i.fas.fa-circle-notch.fa-spin.fa-sm.me-2(v-if="loading._")
protected-formatted-number(:value="asset.price" :fractionDigits="-1" :protected="protected")
</template>

<script>
import {app} from '@/bootstrap/app'
import {ExchangeService} from '@/app/services/exchange-service'
import ProtectedFormattedNumber from './ProtectedFormattedNumber'

export default {
    // eslint-disable-next-line
    name: 'Price',
    emits: ['update'],
    components: {ProtectedFormattedNumber},
    props: {
        asset: Object,
        protected: {
            type: Boolean,
            default: true,
        },
    },
    data() {
        return {
            loading: {
                _: false,
            },

            timeout: {
                handle: null,
                duration: 20 * 1000, // milliseconds
            },
        }
    },
    beforeUnmount() {
        console.log('clear fetching')
        this.clearFetchPrice()
    },
    mounted() {
        this.fetchPrice()
    },
    methods: {
        clearFetchPrice() {
            this.timeout.handle && clearTimeout(this.timeout.handle)
        },
        fetchPrice() {
            this.loading._ = true
            app.$service(ExchangeService)
                .done(data => {
                    this.$emit('update', {
                        price: data.symbol.price,
                        chartUrl: data.symbol.chart_url,
                    })
                })
                .always(() => {
                    this.loading._ = false

                    this.timeout.handle = setTimeout(() => this.fetchPrice(), this.timeout.duration)
                })
                .symbolShow(this.asset.exchange, this.asset.symbol)
        },
    },
}
</script>
