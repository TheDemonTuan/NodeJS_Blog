const { LRUCache } = require('lru-cache')
const options = {
    max: 500,

    maxSize: 5000,
    sizeCalculation: (value, key) => {
        return 1
    },

    ttl: 1000 * 60 * 5,

    allowStale: false,

    updateAgeOnGet: false,
    updateAgeOnHas: false,
}

module.exports = new LRUCache(options)