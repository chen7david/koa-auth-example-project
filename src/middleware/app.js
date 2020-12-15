const { ValidationError } = require('joi')

module.exports = {

    mutator: async (err, ctx, next) => {
        console.log('mutator')
        
        if(err instanceof ValidationError)
        console.log('adx', err instanceof ValidationError)
        return err
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