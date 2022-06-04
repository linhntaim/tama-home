import {StarterService} from '@/app/support/services'

export class HoldingAssetService extends StarterService
{
    add(exchange, symbol, amount) {
        return this.post('account/holding/asset', {
            exchange,
            symbol,
            amount,
        })
    }

    remove(id) {
        return this.delete(`account/holding/asset/${id}`)
    }

    updateAmount(id, amount) {
        return this.post(`account/holding/asset/${id}`, {amount})
    }

    updateOrders(assets) {
        return this.post('account/holding/asset', {
            _orders: 1,
            assets,
        })
    }
}
