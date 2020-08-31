const config = require('../config');

module.exports = {
   client: config.database.client,
   connection: {
       ...config.database.connection,
       dateStrings: true,
       typeCast: (field, next) => {
           if (field.type === 'TINY' && field.length === 1) {
               let value = field.string();
               return value ? (value === '1') : null;
           }
           return next();
       }
   },
   migrations: {
       tableName: 'knex_migrations',
       directory: __dirname + '/migrations'
   },
   seeds: {
       directory: __dirname + '/seeds'
   }
};