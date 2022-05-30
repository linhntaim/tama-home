<template lang="pug">
add-form.mb-3(v-if="adding" @add="onAdd")
.table-responsive
    table.table.align-middle
        thead
            tr
                th.text-nowrap.text-center(colspan="4")
                    .btn-group(role="group" aria-label="Actions")
                        button.btn.btn-sm.border-0(type="button" @click="onAddClick" title="Add" data-bs-toggle="tooltip")
                            i.fas.fa-plus-circle
                        button.btn.btn-sm.border-0(type="button" @click="onProtectClick" title="Protect" data-bs-toggle="tooltip")
                            i.fas(:class="protected ? 'fa-eye-slash' : 'fa-eye'")
                        button.btn.btn-sm.border-0(type="button" @click="onExportClick" title="Export" data-bs-toggle="tooltip")
                            i.fas.fa-file-export
                        button.btn.btn-sm.border-0(type="button" @click="onImportClick" title="Import" data-bs-toggle="tooltip")
                            i.fas.fa-file-import
                th.text-nowrap.text-end
                    span.text-primary Initial (USD)
                th.text-nowrap.text-end
                    span(
                        :class="{'text-danger': profit < 0, 'text-success': profit > 0, 'text-light': profit === 0}"
                        @click="onProfitClick"
                    ) Profit (USD)
                th.text-nowrap.text-end
                    span.text-info Current (USD)
        tbody
            tr
                td(colspan="4")
                td.text-end
                    protected-formatted-number-input(
                        v-model="initial"
                        :fractionDigits="-1"
                        textClass="text-primary"
                        inputClass="outline-0 border-0 w-100 text-primary text-end"
                        :protected="protected"
                    )
                td.text-end
                    protected-formatted-number(
                        :class="{'text-danger': profit < 0, 'text-success': profit > 0, 'text-light': profit === 0}"
                        :value="profit"
                        :protected="unprotectedProfit ? false : protected"
                    )
                td.text-end
                    protected-formatted-number.text-info(:value="current" :protected="protected")
        thead
            tr
                th.text-nowrap.text-center #
                th.text-nowrap
                th.text-nowrap Coin/Token
                th.text-nowrap.text-end.w180 Price (USD)
                th.text-nowrap.text-end.w180 Amount
                th.text-nowrap.text-end.w180(@click="onCurrentSortClick")
                    | Current (USD)
                    i.fas.ms-2(:class="{'fa-sort text-light': sortCurrent === 0, 'fa-sort-up': sortCurrent === 1, 'fa-sort-down': sortCurrent === 2}")
                th.text-nowrap.text-end.w180 % Current
        tbody
            tr(v-for="(asset, index) in assets")
                td.text-center {{ index + 1 }}
                td.text-center.text-nowrap
                    .btn-group(role="group" aria-label="Item actions")
                        button.btn.btn-sm.border-0(@click="onDeleteClick(asset, index)")
                            i.fas.fa-times
                        button.btn.btn-sm.border-0(:disabled="index === 0" @click="onMoveUpClick(asset, index)")
                            i.fas.fa-arrow-up
                        button.btn.btn-sm.border-0(:disabled="index === assets.length - 1" @click="onMoveDownClick(asset, index)")
                            i.fas.fa-arrow-down
                th
                    a.btn.btn-link.btn-sm(:class="{disabled: !asset.chartUrl}" :href="asset.chartUrl ? asset.chartUrl : '#'" target="_blank")
                        i.fas.fa-chart-area
                    | {{ asset.symbol }}
                td.text-end
                    price(:asset="asset" :protected="protected" @update="onPriceUpdate(asset, index, $event)")
                td.text-end
                    protected-formatted-number-input(
                        v-model="asset.amount"
                        :fractionDigits="-1"
                        inputClass="outline-0 border-0 w-100 h-100 text-end"
                        :protected="protected"
                    )
                td.text-end
                    protected-formatted-number(:value="asset.price * asset.amount" :protected="protected")
                td.text-end
                    protected-formatted-number(:value="current ? asset.price * asset.amount / current * 100 : 0" :protected="protected")
</template>

<script>
import AddForm from './AddForm'
import Price from './Price'
import ProtectedFormattedNumber from './ProtectedFormattedNumber'
import ProtectedFormattedNumberInput from './ProtectedFormattedNumberInput'
import {mapActions, mapGetters} from 'vuex'

export default {
    // eslint-disable-next-line
    name: 'Index',
    components: {AddForm, ProtectedFormattedNumber, ProtectedFormattedNumberInput, Price},
    data() {
        return {
            loading: {
                _: false,
            },

            adding: false,

            protected: true,
            unprotectedProfit: !!this.$route.query.unprotected_profit,
            sortCurrent: 0, // desc

            initial: 0,
            initialCanUpdate: true,
            assets: [],
        }
    },
    computed: {
        ...mapGetters({
            holding: 'holding/holding',
            holdingForStore: 'holding/holdingForStore',
        }),
        profit() {
            return this.current - this.initial
        },
        current() {
            if (this.assets.length <= 0) {
                return this.initial
            }
            let current = 0
            this.assets.forEach(asset => {
                current += asset.price * asset.amount
            })
            return current
        },
    },
    watch: {
        initial(value, oldValue) {
            if (this.initialCanUpdate) {
                this.holdingUpdateInitial(value).catch(() => {
                    this.initialCanUpdate = false
                    this.initial = oldValue
                })
            }
            this.initialCanUpdate = true
        },
        // profit() {
        //     this.updateTitle()
        // },
        // protected() {
        //     this.updateTitle()
        // },
        // unprotectedProfit() {
        //     this.updateTitle()
        // },
    },
    async mounted() {
        await this.protectionFromCache()
        // await this.dataFromCache()
        this.holdingCurrent().then(() => this.fetchData())
    },
    methods: {
        ...mapActions({
            holdingCurrent: 'holding/current',
            holdingRestoreFromFile: 'holding/restoreFromFile',
            holdingUpdateInitial: 'holding/updateInitial',
        }),
        async protectionToCache() {
            await this.$cache.set('holding.protected', this.protected)
        },
        async protectionFromCache() {
            this.protected = await this.$cache.get('holding.protected', true)
        },
        fetchData() {
            this.initialCanUpdate = false
            this.initial = this.holding.initial
            this.assets = []
            this.$nextTick(() => this.holding.assets.forEach(asset => this.add(asset)))
        },
        add(asset) {
            this.assets.push({
                symbol: asset.symbol,
                amount: asset.amount,
                exchange: asset.exchange,
                chartUrl: null,
                price: 0,
            })
        },
        onAdd(asset) {
            this.add(asset)
            this.onUpdate()
            this.onAddClick()
        },
        onAddClick() {
            this.adding = !this.adding
        },
        onProtectClick() {
            this.protected = !this.protected
            this.protectionToCache()
        },
        onExportClick() {
            const filename = 'crypto-holding.json'
            const file = new Blob([JSON.stringify(this.holdingForStore)], {type: 'application/json;charset=utf-8'})
            if (window.navigator.msSaveOrOpenBlob) { // IE10+
                window.navigator.msSaveOrOpenBlob(file, filename)
            }
            else { // Others
                const reader = new FileReader()
                reader.onloadend = function () {
                    const a = document.createElement('a')
                    a.href = reader.result.toString()
                    a.download = filename
                    document.body.appendChild(a)
                    a.click()
                    setTimeout(function () {
                        document.body.removeChild(a)
                    }, 0)
                }
                reader.readAsDataURL(file)
            }
        },
        onImportClick() {
            let input = document.getElementById('inputFileImport')
            if (!input) {
                input = document.createElement('input')
                input.id = 'inputFileImport'
                input.type = 'file'
                input.style.display = 'none'
                input.onchange = e => {
                    if (e.target.files.length) {
                        this.holdingRestoreFromFile(e.target.files[0]).then(() => {
                            this.fetchData()
                            input.value = ''
                        })
                    }
                    else {
                        input.value = ''
                    }
                }
                document.body.appendChild(input)
            }
            input.click()
        },
        onProfitClick() {
            this.unprotectedProfit = !this.unprotectedProfit
        },
        onCurrentSortClick() {
            this.sortCurrent = (this.sortCurrent + 1) % 3
            switch (this.sortCurrent) {
                case 1:
                    this.assets = this.assets.sort((asset1, assets2) => {
                        return asset1.price * asset1.amount - assets2.price * assets2.amount
                    })
                    break
                case 2:
                    this.assets = this.assets.sort((asset1, assets2) => {
                        return assets2.price * assets2.amount - asset1.price * asset1.amount
                    })
                    break
                default:
                    this.assets = this.assets.sort((asset1, assets2) => {
                        return asset1.symbol < assets2.symbol ?
                            -1 : (asset1.symbol > assets2.symbol ? 1 : 0)
                    })
                    break
            }
            this.onUpdate()
        },
        onDeleteClick(asset, index) {
            this.assets.splice(index, 1)
            this.onUpdate()
        },
        onMoveUpClick(asset, index) {
            this.assets.splice(index - 1, 0, this.assets.splice(index, 1)[0])
            this.sortCurrent = 0
            this.onUpdate()
        },
        onMoveDownClick(asset, index) {
            this.assets.splice(index + 1, 0, this.assets.splice(index, 1)[0])
            this.sortCurrent = 0
            this.onUpdate()
        },
        onPriceUpdate(asset, index, $event) {
            this.assets[index].chartUrl = $event.chartUrl
            this.assets[index].price = $event.price
        },
        onUpdate() {
            //this.dataToCache()
        },
    },
}
</script>
