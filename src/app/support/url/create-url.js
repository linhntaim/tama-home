import {registerPropertyFactory} from '@/app/support/helpers'
import {UrlGenerator} from './url-generator'

export function createUrl() {
    return {
        install(app) {
            registerPropertyFactory(app.config.globalProperties, '$url', function () {
                return new UrlGenerator(app._instance.proxy)
            })
        },
    }
}
