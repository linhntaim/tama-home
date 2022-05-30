import {app} from '@/bootstrap/app'
import {HoldingService as AccountHoldingService} from '@/app/services/starter/account/holding-service'

export const holding = {
    namespaced: true,
    state: () => ({
        holding: {
            user_id: 0,
            initial: 0,
            assets: [],
        },
    }),
    mutations: {
        setHolding(state, holding) {
            state.holding = holding
        },
        setInitial(state, initial) {
            state.holding.initial = initial
        },
        pushAsset(state, asset) {
            state.holding.assets.push(asset)
        },
    },
    actions: {
        storeToCache(context) {
            return app.$cache.set('holding.data', context.getters.holdingForStore)
        },
        restoreFromCache(context) {
            if (context.state.holding.initial === 0 && context.state.holding.assets.length === 0) {
                return app.$cache.get('holding.data', {}).then(data => {
                    context.commit('setHolding', {
                        user_id: 0,
                        initial: 'initial' in data ? data.initial : 0,
                        assets: 'assets' in data ? data.assets : [],
                    })
                    return data
                })
            }
            return Promise.resolve()
        },
        restoreFromFile(context, file) {
            return new Promise((resolve, reject) => {
                if (file.type === 'application/json') {
                    const reader = new FileReader()
                    reader.addEventListener('load', e => {
                        const data = JSON.parse(
                            atob(e.target.result.substr('data:application/json;base64,'.length)),
                        )
                        context.commit('setHolding', {
                            user_id: 0,
                            initial: 'initial' in data ? data.initial : 0,
                            assets: 'assets' in data ? data.assets : [],
                        })
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
        current(context) {
            if (app.$store.getters['account/isLoggedIn']) {
                return app.$service(AccountHoldingService)
                    .done(async data => {
                        context.commit('setHolding', data.model)
                        if (data.model.initial === 0 && data.model.assets.length === 0) {
                            await context.dispatch('restoreFromCache')
                        }
                    })
                    .current()
            }
            return context.dispatch('restoreFromCache')
        },
        updateInitial(context, initial) {
            context.commit('setInitial', initial)
            if (app.$store.getters['account/isLoggedIn']) {
                return app.$service(AccountHoldingService)
                    .updateInitial(initial)
            }
            return context.dispatch('storeToCache')
        },
    },
    getters: {
        holding: state => state.holding,
        holdingForStore: state => ({
            initial: state.holding.initial,
            assets: state.holding.assets.map(asset => ({
                symbol: asset.symbol,
                amount: asset.amount,
                exchange: asset.exchange,
            })),
        }),
    },
}
