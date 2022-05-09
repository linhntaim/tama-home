import {StarterService} from '@/app/support/services'

export class SwingTradeService extends StarterService {
    swing(exchange, indicator, symbol, interval) {
        return this.get(`swing-trade/${exchange}/${indicator}`, {symbol, interval})
    }
}