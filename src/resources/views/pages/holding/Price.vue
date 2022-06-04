<template lang="pug">
protected-formatted-number(:class="{'opacity-50': loading._ && !protected}" :value="asset.price" :fractionDigits="-1" :protected="protected")
</template>

<script>
import {app} from '@/bootstrap/app'
import {ExchangeService} from '@/app/services/starter/exchange-service'
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
            if (this.loading._) {
                return
            }
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
