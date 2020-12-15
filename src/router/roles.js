const router = require('koa-router')()
const { controllers } = require('goload')()

router.get('/roles', controllers.roles.index)

module.exports = router 
