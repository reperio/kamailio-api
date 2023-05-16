const moment = require('moment');
const crypto = require("crypto");

class SubscribersRepository {
    constructor(uow) {
        this.uow = uow;
    }

    async getAllSubscribers() {
        try {
            return await this.uow._models.Subscribers
                .query(this.uow._transaction)
        } catch (err) {
            this.uow._logger.error(err);
            this.uow._logger.error('Failed to get all subscribers');
            throw err;
        }
    }

    async getSubscriberById(id) {
        try {
            return await this.uow._models.Subscribers
                .query(this.uow._transaction)
                .findOne({id});
        } catch (err) {
            this.uow._logger.error(err);
            this.uow._logger.error('Failed to get subscriber by id');
        }
    }

    async removeSubscriberById(id) {
        try {
            return await this.uow._models.Subscribers
                .query(this.uow._transaction)
                .where({
                    id: id
                })
                .delete();
        } catch (err) {
            this.uow._logger.error(err);
            this.uow._logger.error('Failed to delete subscriber by id');
        }
    }

    async getSubscriberByUsernameAndDomain(username,domain) {
        try {
            return await this.uow._models.Subscribers
                .query(this.uow._transaction)
                .findOne({
                    username: username,
                    domain: domain
                });
        } catch (err) {
            this.uow._logger.error(err);
            this.uow._logger.error(`Failed to get subscriber by username (${username}) and domain (${domain})`);
        }
    }

    async createSubscriber(id,username,domain,{ password = null, ha1 = null, ha1b = null } = {}) {
        try {
            const datetime = moment.utc()
            return await this.uow._models.Subscribers
                .query(this.uow._transaction)
                .insertAndFetch({
                    id,
                    username: username,
                    domain: domain,
                    password: password || crypto.randomBytes(20).toString('hex'),
                    ha1: ha1 || crypto.createHash('md5').update(`${username}:${domain}:${password}`).digest("hex"),
                    ha1b: ha1b || crypto.createHash('md5').update(`${username}@${domain}:${domain}:${password}`).digest("hex"),
                    createdAt: datetime,
                    updatedAt: datetime
                });
        } catch (err) {
            this.uow._logger.error(err);
            this.uow._logger.error(`Failed to create subscriber with id: ${id}`);
            throw err;
        }
    }
}

module.exports = SubscribersRepository;