const BaseModel = require('./baseModel');

class Locations extends BaseModel {
    static get tableName() {
        return 'location';
    }

    static get idColumn() {
        return 'id';
    }

    static get jsonSchema() {
        return {
            type: 'Object',
            properties: {
                id: { type: 'integer' },
                ruid: { type: 'string' },
                username: { type: 'string' },
                domain: { type: ['string', 'null'] },
                contact: { type: 'string' },
                recevied: { type: ['string', 'null'] },
                path: { type: ['string', 'null'] },
                expires: { type: 'timestamp' },
                q: { type: 'number' },
                callid: { type: 'string' },
                cseq: { type: 'integer' },
                last_modified: { type: 'timestamp' },
                flags: { type: 'integer' },
                cflags: { type: 'integer' },
                user_agent: { type: 'string' },
                socket: { type: ['string', 'null'] },
                methods: { type: ['integer', 'null'] },
                instance: { type: ['string', 'null'] },
                reg_id: { type: 'integer' },
                server_id: { type: 'integer' },
                connection_id: { type: 'integer' },
                keepalive: { type: 'integer' },
                partition: { type: 'integer' }
            }
        };
    }
}

module.exports = Locations;
