

module.exports = {
    index: async (ctx) => {
        ctx.throw(200,'this is an Error Message')
        ctx.body = "hello from controller"
    }
}