

module.exports = {
    index: async (ctx) => {
        ctx.throw(422,'this is an Error Message', {number:4})
        ctx.body = "hello from controller"
    }
}