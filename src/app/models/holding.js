import {app} from '@/bootstrap/app'
import {HoldingService as AccountHoldingService} from '@/app/services/starter/account/holding-service'
import {HoldingAssetService as AccountHoldingAssetService} from '@/app/services/starter/account/holding-asset-service'

export const holding = {
    namespaced: true,
    state: () => ({
        userId: 0,
        initial: 0,
        assets: [],
    }),
    mutations: {
        setUserId(state, userId) {
            state.userId = userId
        },
        setInitial(state, initial) {
            state.initial = initial
        },
        setAssets(state, assets) {
            state.assets = assets.map(asset => ({
                id: 'id' in asset ? asset.id : 0,
                exchange: asset.exchange,
                symbol: asset.symbol,
                amount: asset.amount,
                chartUrl: null,
                price: 0,
            }))
        },
        addAsset(state, asset) {
            state.holding.assets.push({
                id: 'id' in asset ? asset.id : 0,
                exchange: asset.exchange,
                symbol: asset.symbol,
                amount: asset.amount,
                chartUrl: null,
                price: 0,
            })
        },
    },
    actions: {
        reset(context) {
            context.commit('setUserId', 0)
            context.commit('setInitial', 0)
            context.commit('setAssets', [])
        },
        import(context, file) {
            return new Promise((resolve, reject) => {
                if (file.type === 'application/json') {
                    const reader = new FileReader()
                    reader.addEventListener('load', e => {
                        const data = JSON.parse(
                            atob(e.target.result.substr('data:application/json;base64,'.length)),
                        )
                        if ('initial' in data || 'assets' in data) {
                            context.commit('setUserId', 0)
                            context.commit('setInitial', 'initial' in data ? data.initial : 0)
                            context.commit('setAssets', 'assets' in data ? data.assets : [])
                        }
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
            return app.$cache.get('holding.data', {}).then(data => {
                if ('initial' in data || 'assets' in data) {
                    context.commit('setUserId', 0)
                    context.commit('setInitial', 'initial' in data ? data.initial : 0)
                    context.commit('setAssets', 'assets' in data ? data.assets : [])
                }
                return data
            })
        },
        serviceCurrent(context) {
            return app.$service(AccountHoldingService)
                .done(async data => {
                    context.commit('setUserId', data.model.user_id)
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
            return context.dispatch('storeToCache').then(() => context.commit('setInitial', initial))
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
            return context.dispatch('storeToCache').then(() => context.dispatch('cacheCurrent'))
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
        cacheRemoveAsset(context, asset) {
            const holdingForStore = context.getters.holdingForStore
            const foundIndex = holdingForStore.assets.findIndex(a => a.exchange === asset.exchange && a.symbol === asset.symbol)
            if (foundIndex !== -1) {
                holdingForStore.assets.splice(foundIndex, 1)
                return context.dispatch('storeToCache').then(() => context.dispatch('cacheCurrent'))
            }
            return Promise.resolve()
        },
        serviceRemoveAsset(context, asset) {
            return app.$service(AccountHoldingAssetService)
                .done(() => context.dispatch('serviceCurrent'))
                .remove(asset.id)
        },
        removeAsset(context, asset) {
            return app.$store.getters['account/isLoggedIn']
                ? context.dispatch('serviceRemoveAsset', asset)
                : context.dispatch('cacheRemoveAsset', asset)
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
