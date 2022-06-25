import {env} from './env'
import {trim} from 'locutus/php/strings'

export const app = {
    id: env.VUE_APP_ID || 'starter',
    name: env.VUE_APP_NAME || 'Starter',
    url: window.location.origin + trim(env.BASE_URL, '/'),

    ping: {
        expired_in: 60 * 1000, // 1 minute
    },

    routes: {
        root: {
            name: 'root',
        },
        connection_lost: {
            name: 'connection_lost',
        },
        redirect_if_unauthenticated: {
            name: 'unauthenticated',
        },
        redirect_if_authenticated: {
            name: 'root',
        },
    },
}
