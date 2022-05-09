import {StarterService} from '@/app/support/services'

export class ExchangeService extends StarterService {
    symbolIndex(exchange) {
        return this.get(`exchange/${exchange}/symbol`)
    }

    intervalIndex(exchange) {
        return this.get(`exchange/${exchange}/interval`)
    }
}