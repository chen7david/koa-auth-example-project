const Model = require('./Model')
const bcrypt = require('bcrypt')
const BCRYPT_ROUNDS = 12
const { serialChar, dd } = require('koatools')

class User extends Model {
 
    async verifyPassword(password){
        return await bcrypt.compare(password, this.password)    
    }
 
    async $beforeInsert(context){
        await super.$beforeInsert(context)
        if(this.password) this.password = await bcrypt
            .hash(this.password, BCRYPT_ROUNDS)
        if(this.username) this.username = this.username.toLowerCase()
        if(this.passwordConfirm) delete this.passwordConfirm
        this.userId = serialChar("US0000000000")
    }

    async $beforeUpdate(context){
        await super.$beforeInsert(context)
        if(this.password) this.password = await bcrypt
            .hash(this.password, BCRYPT_ROUNDS)
        if(this.email) this.confirmed = false
    }

    async $afterFind(context){
        await super.$afterFind(context)
        this.roles = await this.$relatedQuery('roles')
    }

    /* TOKEN CONTROLL */

    async getTokenById(tokenId){
        return await this.$relatedQuery('tokens').where('tokenId', tokenId).first()
    }

    async createToken(useragent){
        return await this.$relatedQuery('tokens').insert({useragent})
    }
    
    /* ACCESS CONTROLL */

    async hasAnyRoles(...names){
        if(!this.roles) this.roles = await this.$relatedQuery('roles')
        return this.roles.find(r => names.includes(r.name)) != null
    }
    
    isDisabled(){
        return this.disabled
    }

    async disable(){
        return await this.$query().patch({disabled: true})
    }

    async enable(){
        return await this.$query().patch({disabled: false})
    }

    isConfirmed(){
        return this.confirmed
    }

    async confirm(){
        return await this.$query().patch({confirmed: true})
    }

    isSuspended(){
        return this.suspended
    }

    async suspend(){
        return await this.$query().patch({suspended: true})
    }

    async unsuspend(){
        return await this.$query().patch({suspended: false})
    }

    static get relationMappings(){   
        
        const Role = require('./Role')
        const Token = require('./Token')
        
        return {

            tokens:{
                relation: Model.HasManyRelation,
                modelClass: Token,
                join:{
                    from:'users.id',
                    to:'tokens.user_id'
                }
            },

            roles:{
                relation: Model.ManyToManyRelation,
                modelClass: Role,
                join:{
                    from:'users.id',
                    to:'roles.id',
                    through:{
                        from:'user_roles.user_id',
                        to:'user_roles.role_id'
                    }
                }
            } 
        }
    }    
}

module.exports = User