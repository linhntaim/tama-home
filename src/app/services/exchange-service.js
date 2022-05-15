import {StarterService} from '@/app/support/services'

export class ExchangeService extends StarterService {
    index() {
        return this.get(`exchange`)
    }

    tickerIndex(exchange) {
        return this.get(`exchange/${exchange}/ticker`)
    }

    intervalIndex(exchange) {
        return this.get(`exchange/${exchange}/interval`)
    }

    symbolShow(exchange, symbol) {
        return this.get(`exchange/${exchange}/symbol/${symbol}`)
    }
}