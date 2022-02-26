const { environment } = require('@rails/webpacker')
environment.loaders.prepend('style', require('./addMatildaLessSupport'))
module.exports = environment
