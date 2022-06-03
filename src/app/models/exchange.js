import {app} from '@/bootstrap/app'
import {ExchangeService} from '@/app/services/starter/exchange-service'

export const exchange = {
    namespaced: true,
    state: () => ({
        all: [],
    }),
    mutations: {
        setAll(state, all) {
            state.all = all
        },
    },
    actions: {
        all(context) {
            const all = context.getters.all
            return all.length
                ? new Promise(resolve => resolve(all))
                : app.$service(ExchangeService).done(data => {
                    context.commit('setAll', data.exchanges)
                    return data
                }).index()
        },
    },
    getters: {
        all: state => state.all,
    },
}
