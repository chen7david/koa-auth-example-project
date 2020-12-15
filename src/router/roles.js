const router = require('koa-router')()
const { controllers, middleware: {validate} } = require('goload')()

router.get('/roles', validate.body(validate.schema.roles), controllers.roles.index)

module.exports = router 
