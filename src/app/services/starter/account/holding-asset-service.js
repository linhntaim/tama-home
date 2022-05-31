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
}
