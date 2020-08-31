const {knex, Model} = require('./connect');
const repositories = require('./repositories');

const models = require('./models');

class UnitOfWork {
    constructor(logger) {
        this._knex = knex;
        this._Model = Model;
        this._models = models;
        this._transaction = null;
        this._logger = logger;

        this._cachedRepositories = {};

        for (const [repositoryName, Repository] of Object.entries(repositories)) {
            Object.defineProperty(this, repositoryName, {
                get: () => {
                    this._cachedRepositories[repositoryName] = this._cachedRepositories[repositoryName] || new Repository(this);
                    return this._cachedRepositories[repositoryName];
                }
            });
        }
    }

    async beginTransaction() {
        if (this._transaction != null) {
            throw new Error("A transaction already exists for this unit of work");
        }
        await new Promise(resolve => {
            knex.transaction(trx => {
                this._transaction = trx;
                resolve();
            });
        });
    }

    async commitTransaction() {
        if (this._transaction === null) {
            throw new Error("A transaction does not exist for this unit of work");
        }
        await this._transaction.commit();
        this._transaction = null;
    }

    async rollbackTransaction() {
        if (this._transaction === null) {
            throw new Error("A transaction does not exist for this unit of work");
        }
        await this._transaction.rollback();
        this._transaction = null;
    }

    get inTransaction() {
        return this._transaction !== null;
    }

    async upsert(insertQuery, updateQuery, onConflictColumns) {
        const {sql: insertSql, bindings: insertBindings} = insertQuery.toSQL();

        const {sql: updateSql, bindings: updateBindings} = updateQuery != null ? updateQuery.toSQL() : {sql: null, bindings: []};

        const updateSqlForUpsert = updateSql != null ? updateSql.replace(/^update\s.*\sset\s/i, 'UPDATE SET') : 'NOTHING';
        const onConflictSQL = onConflictColumns.map(columnName => `"${columnName}"`).join(',');

        const query = `${insertSql} ON CONFLICT (${onConflictSQL}) DO ${updateSqlForUpsert}`;
        const bindings = [...insertBindings, ...updateBindings];

        const queryTarget = this._transaction != null ? this._transaction : this._knex;
        return await queryTarget.raw(query, bindings);
    }
}

module.exports = UnitOfWork;
