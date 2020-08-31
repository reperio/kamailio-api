const Knex = require('knex');
const Model = require('objection').Model;

const knexConfig = require('./knexfile');

const knex = Knex(knexConfig);

Model.knex(knex);

module.exports = {
    knex: knex,
    Model: Model
};
