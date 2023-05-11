const moment = require('moment');

class LocationsRepository {
    constructor(uow) {
        this.uow = uow;
    }

    async getAllRegistrations() {
        try {
            return await this.uow._models.Locations
                .query(this.uow._transaction)
        } catch (err) {
            this.uow._logger.error(err);
            this.uow._logger.error('Failed to get all registrations');
            throw err;
        }
    }

    async isRegistered(username, domain) {
        try {
            const datetime = moment.utc().add(1, 'minutes')
            const location = await this.uow._models.Locations
                .query(this.uow._transaction)
                .where('expires', '>', datetime)
                .andWhere('username', username)
                .andWhere('domain', domain)
                .orderBy('expires', 'desc')
                .first();
            if (location && location.length > 0) {
                return true;
            } else {
                return false
            }
        } catch (err) {
            this.uow._logger.error(err);
            this.uow._logger.error(`Failed to retrieve registration for username: ${username}`);
            throw err;
        }
    }

    async getRegistrationExpiration(username, domain) {
        try {
            return await this.uow._models.Locations
                .query(this.uow._transaction)
                .where('username', username)
                .andWhere('domain', domain)
                .orderBy('expires', 'desc')
                .first()
                .select('expires');
        } catch (err) {
            this.uow._logger.error(err);
            this.uow._logger.error(`Failed to get registration expiration for username: ${username}`);
            throw err;
        }
    }
}

module.exports = LocationsRepository;