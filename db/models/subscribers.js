const BaseModel = require('./baseModel');

class Subscribers extends BaseModel {
    static get tableName() {
        return 'subscriber';
    }

    static get idColumn() {
        return 'id';
    }

    static get jsonSchema() {
        return {
            type: 'Object',
            properties: {
                id: {type: 'string'},
                username: {type: 'string'},
                domain: {type: 'string'},
                password: {type: 'string'},
                ha1: {type: 'string'},
                ha1b: {type: 'string'},
                createdAt: {type: 'timestamp'},
                updatedAt: {type: 'timestamp'}
            }
        };
    }
}

module.exports = Subscribers;
