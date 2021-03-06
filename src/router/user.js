const router = require('koa-router')()
const controller = require('./../controllers').user
const { validateBody, schema } = require('./../middleware/validate')

router.get('/users', controller.index)
router.post('/register', validateBody(schema.role), controller.index)
module.exports = router 
