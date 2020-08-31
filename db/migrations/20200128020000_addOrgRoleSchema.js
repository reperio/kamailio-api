exports.up = async function(knex) {
    await knex.schema.createTable('roles', t => {
        t.uuid('id')
            .notNullable()
            .primary();
        t.string('name');
        t.boolean('deleted');
        t.uuid('organizationId')
            .references('id')
            .inTable('organizations');
    });

    await knex.schema.createTable('permissions', t => {
        t.string('name')
            .notNullable()
            .primary();
        t.string('displayName');
        t.string('description');
        t.boolean('deleted');
        t.timestamp('createdAt');
        t.timestamp('updatedAt');
    });

    await knex.schema.createTable('userRoles', t => {
        t.uuid('userId')
            .notNullable();
        t.uuid('roleId')
            .notNullable()
            .references('id')
            .inTable('roles');
    });

    await knex.schema.createTable('rolePermissions', t => {
        t.uuid('roleId')
            .notNullable()
            .references('id')
            .inTable('roles');
        t.string('permissionName')
            .notNullable()
            .references('name')
            .inTable('permissions');
    });
};

exports.down = async function(knex) {
    await knex.schema.dropTableIfExists('roles');
    await knex.schema.dropTableIfExists('permissions');
    await knex.schema.dropTableIfExists('userRoles');
    await knex.schema.dropTableIfExists('rolePermissions');
};
