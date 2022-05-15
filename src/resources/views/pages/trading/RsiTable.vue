<template lang="pug">
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
export default {
    name: 'RsiTable',
    props: {
        swingTrades: Object,
    },
}
</script>