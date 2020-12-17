const router = require('koa-router')()
const controller = require('./../controllers').role
const { validateBody, schema } = require('./../middleware/validate')

router.get('/roles', validateBody(schema.role), controller.index)

module.exports = router 
