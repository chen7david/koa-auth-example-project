const Model = require('./Model')
const User = require('./User')
const { serialChar, dd } = require('koatools')
const { keys: {access, refresh} } = require('confyg')
const JWT = require('jsonwebtoken')

class Token extends Model {

    async $beforeInsert(context){
        await super.$beforeInsert(context)
        this.tokenId = serialChar("TO00-00000000-00000-00000")
    }

    async $afterFind(context){
        await super.$afterFind(context)
        this.user = await this.$relatedQuery('user').first()
    }

    async $afterInsert(context){
        await super.$afterInsert(context)
        this.user = await this.$relatedQuery('user').first()
    }

    static decode(token){
        return JWT.decode(token)
    }

    static verifyAccessToken(token){
        return JWT.verify(token, access.secret)
    }

    static verifyRefreshToken(token, password){
        return JWT.verify(token, refresh.secret + password)
    }

    static async loadAccessToken(token){
        const { tokenId } = this.verifyAccessToken(token)
        return await this.query().where('tokenId', tokenId).first()
    }

    static async loadRefreshToken(token){
        const info = this.decode(token)
        if(!info || info && !info.userId) throw('invalid token format!')
        const user = await User.query().where('userId', info.userId).first()
        if(!user) throw('invalid token format!')
        const { tokenId } = this.verifyRefreshToken(token, user.password)
        return await this.query()
            .where('tokenId', tokenId)
            .andWhere('active', true)
            .andWhere('revoked', false)
            .first()
    }

    renderAccessToken(){
        const {tokenId, user:{ userId }} = this
        const payload = { refresh: false, tokenId, userId }
        const secret = access.secret
        const options = { expiresIn: access.expiry }
        return JWT.sign(payload, secret, options)
    }

    renderRefreshToken(){
        const {tokenId, user:{ userId }} = this
        const payload = { refresh: true, tokenId, userId }
        const secret = refresh.secret + this.user.password
        const options = { expiresIn: refresh.expiry }
        return JWT.sign(payload, secret, options)
    }

    async incrementCalls(){
        const call_count = this.call_count + 1
        return await this.$query().patch({call_count}).returning('*')
    }

    async incrementRefresh(){
        const refresh_count = this.refresh_count + 1
        return await this.$query().patch({refresh_count}).returning('*')
    }

    async logout(){
        return await this.$query().patch({active:false}).returning('*')
    }

    async revoke(){
        return await this.$query().patch({revoked:true}).returning('*')
    }
    
    static get relationMappings(){   
        
        const User = require('./User')
        
        return {
            user:{
                relation: Model.BelongsToOneRelation,
                modelClass: User,
                join:{
                    from:'tokens.user_id',
                    to:'users.id'
                }
            }, 
        }
    }
}

module.exports = Token