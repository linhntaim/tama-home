import {StarterService} from '@/app/support/services'

export class SwingTradeService extends StarterService {
    swing(exchange, indicator, ticker, interval) {
        return this.get(`swing-trade/${exchange}/${indicator}`, {ticker, interval})
    }
}