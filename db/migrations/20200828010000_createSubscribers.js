exports.up = async function(knex) {
    await knex.schema.hasTable('subscriber').then(function(exists) {
        if (!exists) {
          return knex.schema.createTable('subscriber', t => {
            t.uuid('id')
                .notNullable()
                .primary();
            t.string('username', 64);
            t.string('domain', 64);
            t.string('password', 64);
            t.string('ha1', 128);
            t.string('ha1b', 128);
            t.timestamp('createdAt');
            t.timestamp('updatedAt');
        });
        }
      });
};

exports.down = async function(knex) {
    await knex.schema.dropTableIfExists('subscriber');
};
