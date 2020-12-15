const router = require('koa-router')()
const { controllers } = require('goload')()

router.get('/users', controllers.user.index)

module.exports = router 
