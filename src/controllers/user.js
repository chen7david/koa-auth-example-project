const { User } = require('./../models')

module.exports = {
    index: async (ctx) => {
        ctx.throw(422,'this is an Error Message', {x:5})
        ctx.body = "hello from controller"
    }, 

    create: async (ctx) => {
        const data = ctx.request.body
        const user = await User.query().insert(data).returning('*')
        ctx.body = user
    },
}