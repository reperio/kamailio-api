const fs = require('fs');
const path = require('path');
const basename = path.basename(module.filename);

const models = {};

fs
    .readdirSync(__dirname)
    .filter(function(fileName) {
        return (fileName.indexOf('.') !== 0) && (fileName !== basename) && (fileName.slice(-3) === '.js');
    })
    .forEach(function(fileName) {
        const model = require(path.join(__dirname, fileName));
        models[model.name] = model;
    });

module.exports = models;
