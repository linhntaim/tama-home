import {app} from '@/bootstrap/app'
import {HoldingService as AccountHoldingService} from '@/app/services/starter/account/holding-service'
import {HoldingAssetService as AccountHoldingAssetService} from '@/app/services/starter/account/holding-asset-service'

export const holding = {
    namespaced: true,
    state: () => ({
        initial: 0,
        assets: [],
    }),
    mutations: {
        setInitial(state, initial) {
            state.initial = initial
        },
        setAssets(state, assets) {
            const createKey = asset => asset.exchange + '.' + asset.symbol
            const old = {}
            state.assets.forEach(asset => old[createKey(asset)] = {
                price: asset.price,
                chartUrl: asset.chartUrl,
            })
            state.assets = assets.map(asset => {
                const key = createKey(asset)
                const hasOld = key in old
                return {
                    id: 'id' in asset ? asset.id : 0,
                    exchange: asset.exchange,
                    symbol: asset.symbol,
                    amount: asset.amount,
                    price: hasOld ? old[key].price : 0,
                    chartUrl: hasOld ? old[key].chartUrl : null,
                }
            })
        },
        updateAssetPrice(state, {index, price, chartUrl}) {
            state.assets[index].price = price
            state.assets[index].chartUrl = chartUrl
        },
    },
    actions: {
        reset(context) {
            context.commit('setInitial', 0)
            context.commit('setAssets', [])
        },
        async loadData(context, data) {
            if (app.$store.getters['account/isLoggedIn']) {
                await app.$service(AccountHoldingService)
                    .done(async () => await context.dispatch('serviceCurrent'))
                    .save('initial' in data ? data.initial : 0, 'assets' in data ? data.assets : [])
            }
            else {
                if ('initial' in data || 'assets' in data) {
                    context.commit('setInitial', 'initial' in data ? data.initial : 0)
                    context.commit('setAssets', 'assets' in data ? data.assets : [])
                }
            }
            return data
        },
        import(context, file) {
            return new Promise((resolve, reject) => {
                if (file.type === 'application/json') {
                    const reader = new FileReader()
                    reader.addEventListener('load', async e => {
                        const data = await context.dispatch('loadData', JSON.parse(
                            atob(e.target.result.substr('data:application/json;base64,'.length)),
                        ))
                        resolve(data)
                    })
                    reader.addEventListener('error', e => reject(e))
                    reader.readAsDataURL(file)
                }
                else {
                    resolve({})
                }
            })
        },
        storeToCache(context, holdingForStore) {
            return app.$cache.set('holding.data', holdingForStore ? holdingForStore : context.getters.holdingForStore)
        },
        cacheCurrent(context) {
            return app.$cache.get('holding.data', {}).then(async data => await context.dispatch('loadData', data))
        },
        serviceCurrent(context) {
            return app.$service(AccountHoldingService)
                .done(async data => {
                    context.commit('setInitial', data.model.initial)
                    context.commit('setAssets', data.model.assets)
                    if (data.model.initial === 0 && data.model.assets.length === 0) {
                        await context.dispatch('cacheCurrent')
                    }
                })
                .current()
        },
        current(context) {
            return app.$store.getters['account/isLoggedIn']
                ? context.dispatch('serviceCurrent')
                : context.dispatch('cacheCurrent')
        },
        cacheUpdateInitial(context, initial) {
            const holdingForStore = context.getters.holdingForStore
            holdingForStore.initial = initial
            return context.dispatch('storeToCache', holdingForStore).then(() => context.commit('setInitial', initial))
        },
        serviceUpdateInitial(context, initial) {
            return app.$service(AccountHoldingService)
                .done(() => context.commit('setInitial', initial))
                .updateInitial(initial)
        },
        updateInitial(context, initial) {
            return app.$store.getters['account/isLoggedIn']
                ? context.dispatch('serviceUpdateInitial', initial)
                : context.dispatch('cacheUpdateInitial', initial)
        },
        cacheAddAsset(context, asset) {
            const holdingForStore = context.getters.holdingForStore
            const found = holdingForStore.assets.findIndex(a => a.exchange === asset.exchange && a.symbol === asset.symbol)
            if (found === -1) {
                holdingForStore.assets.push({
                    exchange: asset.exchange,
                    symbol: asset.symbol,
                    amount: asset.amount,
                })
            }
            else {
                holdingForStore.assets[found].amount += asset.amount
            }
            return context.dispatch('storeToCache', holdingForStore).then(() => context.dispatch('cacheCurrent'))
        },
        serviceAddAsset(context, asset) {
            return app.$service(AccountHoldingAssetService)
                .done(() => context.dispatch('serviceCurrent'))
                .add(asset.exchange, asset.symbol, asset.amount)
        },
        addAsset(context, asset) {
            return app.$store.getters['account/isLoggedIn']
                ? context.dispatch('serviceAddAsset', asset)
                : context.dispatch('cacheAddAsset', asset)
        },
        cacheRemoveAsset(context, {index}) {
            if (index >= 0 && index <= context.state.assets.length - 1) {
                const holdingForStore = context.getters.holdingForStore
                holdingForStore.assets.splice(index, 1)
                return context.dispatch('storeToCache', holdingForStore).then(() => context.dispatch('cacheCurrent'))
            }
            return Promise.resolve()
        },
        serviceRemoveAsset(context, {asset}) {
            return app.$service(AccountHoldingAssetService)
                .done(() => context.dispatch('serviceCurrent'))
                .remove(asset.id)
        },
        removeAsset(context, {asset, index}) {
            return app.$store.getters['account/isLoggedIn']
                ? context.dispatch('serviceRemoveAsset', {asset})
                : context.dispatch('cacheRemoveAsset', {index})
        },
        cacheUpdateAssetAmount(context, {index, amount}) {
            if (index >= 0 && index <= context.state.assets.length - 1) {
                const holdingForStore = context.getters.holdingForStore
                holdingForStore.assets[index].amount = amount
                return context.dispatch('storeToCache', holdingForStore).then(() => context.dispatch('cacheCurrent'))
            }
            return Promise.resolve()
        },
        serviceUpdateAssetAmount(context, {asset, amount}) {
            return app.$service(AccountHoldingAssetService)
                .done(() => context.dispatch('serviceCurrent'))
                .updateAmount(asset.id, amount)
        },
        updateAssetAmount(context, {asset, index, amount}) {
            return app.$store.getters['account/isLoggedIn']
                ? context.dispatch('serviceUpdateAssetAmount', {asset, amount})
                : context.dispatch('cacheUpdateAssetAmount', {index, amount})
        },
        cacheMoveUpAsset(context, {index}) {
            if (index > 0) {
                const holdingForStore = context.getters.holdingForStore
                holdingForStore.assets.splice(index - 1, 0, holdingForStore.assets.splice(index, 1)[0])
                return context.dispatch('storeToCache', holdingForStore).then(() => context.dispatch('cacheCurrent'))
            }
            return Promise.resolve()
        },
        serviceMoveUpAsset(context, {index}) {
            if (index > 0) {
                return app.$service(AccountHoldingAssetService)
                    .done(() => context.dispatch('serviceCurrent'))
                    .updateOrders([
                        {
                            id: context.state.assets[index].id,
                            order: index - 1,
                        },
                        {
                            id: context.state.assets[index - 1].id,
                            order: index,
                        },
                    ])
            }
            return Promise.resolve()
        },
        moveUpAsset(context, {index}) {
            return app.$store.getters['account/isLoggedIn']
                ? context.dispatch('serviceMoveUpAsset', {index})
                : context.dispatch('cacheMoveUpAsset', {index})
        },
        cacheMoveDownAsset(context, {index}) {
            if (index < context.state.assets.length - 1) {
                const holdingForStore = context.getters.holdingForStore
                holdingForStore.assets.splice(index + 1, 0, holdingForStore.assets.splice(index, 1)[0])
                return context.dispatch('storeToCache', holdingForStore).then(() => context.dispatch('cacheCurrent'))
            }
            return Promise.resolve()
        },
        serviceMoveDownAsset(context, {index}) {
            if (index < context.state.assets.length - 1) {
                return app.$service(AccountHoldingAssetService)
                    .done(() => context.dispatch('serviceCurrent'))
                    .updateOrders([
                        {
                            id: context.state.assets[index + 1].id,
                            order: index,
                        },
                        {
                            id: context.state.assets[index].id,
                            order: index + 1,
                        },
                    ])
            }
            return Promise.resolve()
        },
        moveDownAsset(context, {index}) {
            return app.$store.getters['account/isLoggedIn']
                ? context.dispatch('serviceMoveDownAsset', {index})
                : context.dispatch('cacheMoveDownAsset', {index})
        },
        cacheSortAsset(context, {sortFunc, ascending = true}) {
            const func = (asset1, asset2) => ascending ? sortFunc(asset1, asset2) : 0 - sortFunc(asset1, asset2)
            return context.dispatch('storeToCache', {
                initial: context.state.initial,
                assets: context.state.assets
                    .map((asset, i) => ({i, asset}))
                    .sort((m1, m2) => func(m1.asset, m2.asset))
                    .map(m => ({
                        exchange: m.asset.exchange,
                        symbol: m.asset.symbol,
                        amount: m.asset.amount,
                    })),
            }).then(() => context.dispatch('cacheCurrent'))
        },
        serviceSortAsset(context, {sortFunc, ascending = true}) {
            const func = (asset1, asset2) => ascending ? sortFunc(asset1, asset2) : 0 - sortFunc(asset1, asset2)
            return app.$service(AccountHoldingAssetService)
                .done(() => context.dispatch('serviceCurrent'))
                .updateOrders(
                    context.state.assets
                        .map((asset, i) => ({i, asset}))
                        .sort((m1, m2) => func(m1.asset, m2.asset))
                        .map((m, i) => ({
                            id: m.asset.id,
                            order: i,
                        })),
                )
        },
        sortAsset(context, {sortFunc, ascending = true}) {
            return app.$store.getters['account/isLoggedIn']
                ? context.dispatch('serviceSortAsset', {sortFunc, ascending})
                : context.dispatch('cacheSortAsset', {sortFunc, ascending})
        },
        sortAssetBySymbol(context, ascending = true) {
            const sortFunc = (asset1, assets2) => asset1.symbol < assets2.symbol ? -1 : (asset1.symbol > assets2.symbol ? 1 : 0)
            return app.$store.getters['account/isLoggedIn']
                ? context.dispatch('serviceSortAsset', {sortFunc, ascending})
                : context.dispatch('cacheSortAsset', {sortFunc, ascending})
        },
        sortAssetByPriceTotal(context, ascending = true) {
            const sortFunc = (asset1, assets2) => asset1.price * asset1.amount - assets2.price * assets2.amount
            return app.$store.getters['account/isLoggedIn']
                ? context.dispatch('serviceSortAsset', {sortFunc, ascending})
                : context.dispatch('cacheSortAsset', {sortFunc, ascending})
        },
    },
    getters: {
        holding: state => ({
            initial: state.initial,
            assets: state.assets,
        }),
        holdingForStore: state => ({
            initial: state.initial,
            assets: state.assets.map(asset => ({
                exchange: asset.exchange,
                symbol: asset.symbol,
                amount: asset.amount,
            })),
        }),
    },
}
