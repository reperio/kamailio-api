const {Model} = require('objection');

class Permission extends Model {
    static get tableName() {
        return 'permissions';
    }

    static get idColumn() {
        return 'name'
    }

    static get jsonSchema() {
        return {
            type: 'Object',
            properties: {
                name: {type: 'string'},
                displayName: {type: 'string'},
                description: {type: 'string'},
                deleted: {type: 'boolean'},
                createdAt: {type: 'timestamp'},
                updatedAt: {type: 'timestamp'}
            }
        }
    }
}

module.exports = Permission;
