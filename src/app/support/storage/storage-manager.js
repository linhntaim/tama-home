import {Drivers} from '../drivers'
import {LocalStorage} from './local-storage'
import {CookieStorage} from '@/app/support/storage/cookie-storage'

export class StorageManager extends Drivers
{
    constructor(app) {
        super(app, 'storage', 'local')
    }

    encryptor(encryptorDriver) {
        return encryptorDriver
            ? this.app.config.globalProperties.$encryption.driver(encryptorDriver)
            : this.app.config.globalProperties.$encryptor
    }

    createLocal() {
        const options = this.options('local')
        return new LocalStorage(this.encryptor(options.encryptor), options)
    }

    createCookie() {
        const options = this.options('cookie')
        return new CookieStorage(this.encryptor(options.encryptor), options)
    }
}