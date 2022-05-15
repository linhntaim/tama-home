const fs = require('fs')

const vendors = {
    './node_modules/bootstrap/dist': './public/vendor/bootstrap/dist',
    './node_modules/@fortawesome/fontawesome-free/css': './public/vendor/fontawesome-free/css',
    './node_modules/@fortawesome/fontawesome-free/webfonts': './public/vendor/fontawesome-free/webfonts',
}
Object.keys(vendors).forEach(source => {
    const destination = vendors[source]
    if (!fs.existsSync(destination)) {
        fs.mkdirSync(destination, {recursive: true})
    }
    fs.cpSync(source, destination, {recursive: true})
})
