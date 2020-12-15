module.exports = {
    mutator: async (err, ctx, next) => {
        console.log('mutator')
        console.log({err, ctx, next})
        return 'what!!!!!!'
    },
    errors: (cb = null) => async (ctx, next) => {
        try {
            await next()
        } catch (err) {
            console.log('errors')
            ctx.status = err.status || 500
            ctx.body = cb ? await cb(err, ctx, next) : err.message
            ctx.app.emit('error', err, ctx)
        }
    },

    logger: (err, ctx) => {
        console.log('logger')
        console.log(err)
    }
}