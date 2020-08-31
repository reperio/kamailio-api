exports.up = async function (knex) {
    await knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');
    await knex.schema.createTable('organizations', t => {
        t.uuid('id')
            .notNullable()
            .primary();
        t.boolean('active');
        t.boolean('deleted');
        t.timestamp('createdAt');
        t.timestamp('updatedAt');
    });
};

exports.down = async function (knex) {
    await knex.schema.dropTableIfExists('organizations');
};
