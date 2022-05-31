import {StarterService} from '@/app/support/services'

export class HoldingService extends StarterService
{
    current() {
        return this.get('account/holding/current')
    }

    updateInitial(initial) {
        return this.post('account/holding/current', {initial})
    }

    assetAdd(exchange, symbol, amount) {
        return this.post('account/holding/asset', {
            exchange,
            symbol,
            amount,
        })
    }

    assetRemove(id) {
        return this.delete(`account/holding/asset/${id}`)
    }
}
