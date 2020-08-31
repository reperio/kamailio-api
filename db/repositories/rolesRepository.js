const v4 = require('uuid/v4');

class RolesRepository {
    constructor(uow) {
        this.uow = uow;
    }
}

module.exports = RolesRepository;
