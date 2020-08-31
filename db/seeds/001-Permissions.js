const moment = require('moment');

exports.seed = async function(knex) {
    await knex('permissions').insert([
        {
            name: 'View',
            displayName: 'View',
            description: 'View',
            deleted: false,
            createdAt: moment.utc(),
            updatedAt: moment.utc(),
        },
        {
            name: 'Create',
            displayName: 'Create',
            description: 'Create',
            deleted: false,
            createdAt: moment.utc(),
            updatedAt: moment.utc(),
        },
        {
            name: 'Update',
            displayName: 'Update',
            description: 'Update',
            deleted: false,
            createdAt: moment.utc(),
            updatedAt: moment.utc(),
        },
        {
            name: 'Delete',
            displayName: 'Delete',
            description: 'Delete',
            deleted: false,
            createdAt: moment.utc(),
            updatedAt: moment.utc(),
        },
    ]);
}