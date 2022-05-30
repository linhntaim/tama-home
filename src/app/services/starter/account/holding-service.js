import {StarterService} from '@/app/support/services'

export class HoldingService extends StarterService
{
    current() {
        return this.get('account/holding/current')
    }

    updateInitial(initial) {
        return this.post('account/holding/current', {
            initial: initial,
        })
    }
}
