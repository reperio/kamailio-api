const fs = require('fs');
const path = require('path');
const basename = path.basename(module.filename);

const repositories = {};

fs
    .readdirSync(__dirname)
    .filter(function(fileName) {
        return (fileName.indexOf('.') !== 0) && (fileName !== basename) && (fileName.slice(-3) === '.js');
    })
    .forEach(function(fileName) {
        const repositoryName = fileName.slice(0, -3);
        repositories[repositoryName] = require(path.join(__dirname, fileName));
    });

module.exports = repositories;
