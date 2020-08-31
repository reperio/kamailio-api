const delay = require('delay');
const {knex} = require('./connect');

async function initializeDatabase() {
    let attemptMigrations = true;
    while (attemptMigrations) {
        try {
            console.log('attempting to run db migrations');
            await knex.migrate.latest();
            console.log('db migrations ran successfully');
            attemptMigrations = false;
        } catch (e) {
            console.log('unable to run migrations, will retry');
            console.log(e);
            await delay(2000);
        }
    }
}

initializeDatabase()
    .then(() => process.exit(0), () => process.exit(-1));