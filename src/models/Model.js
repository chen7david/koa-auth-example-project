const knexfile = require('./../../knexfile').development
const knex = require('knex')(knexfile)
const OM = require('koatools').BaseModel
const { Model } = require('objection')
 
Model.knex(knex)
 
class BaseModel extends OM(Model) {
 
    $formatJson(json) {
        json = super.$formatJson(json)
        delete json.user_id
        delete json.password
        return json
    }
 
}

module.exports = BaseModel