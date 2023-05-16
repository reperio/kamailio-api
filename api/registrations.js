const Joi = require('joi');
const Boom = require('boom');

module.exports = [
    {
        method: 'GET',
        path: '/v1/registrations',
        handler: async (request, h) => {
            const logger = request.server.app.logger;
            logger.debug('Getting registered users');
            const uow = await request.app.getNewUoW();
            try {
                const registrations = await uow.locationsRepository.getAllRegistrations();
                return registrations || {};
            } catch (err) {
                logger.error(err);
                logger.error('Error fetching registered users');
                return Boom.badImplementation('Error fetching registered users');
            }
        },
        options: {
            auth: false
        }
    },
    {
        method: 'GET',
        path: '/v1/registration',
        handler: async (request, h) => {
            const logger = request.server.app.logger;
            const { username, domain } = request.query;
            logger.info(`Verifying registration status for username: ${username} domain: ${domain}`);
            const uow = await request.app.getNewUoW();
            try {
                const registration = await uow.locationsRepository.getRegistration(username, domain);
                if (registration && typeof registration === 'object' && registration !== null) {
                    return true;
                } else {
                    return false;
                }
            } catch (err) {
                logger.error(err);
                logger.error('Error fetching registration status');
                return Boom.badImplementation('Error fetching registration status');
            }
        },
        options: {
            auth: false,
            validate: {
                query: {
                    username: Joi.string().optional(),
                    domain: Joi.string().optional()
                }
            }
        }
    },
    {
        method: 'GET',
        path: '/v1/registration/',
        handler: async (request, h) => {
            const logger = request.server.app.logger;
            const { username, domain } = request.query;
            logger.info(`Verifying registration status for username: ${username} domain: ${domain}`);
            const uow = await request.app.getNewUoW();
            try {
                const registration = await uow.locationsRepository.getRegistration(username, domain);
                if (registration && typeof registration === 'object' && registration !== null) {
                    return true;
                } else {
                    return false;
                }
            } catch (err) {
                logger.error(err);
                logger.error('Error fetching registration status');
                return Boom.badImplementation('Error fetching registration status');
            }
        },
        options: {
            auth: false,
            validate: {
                query: {
                    username: Joi.string().optional(),
                    domain: Joi.string().optional()
                }
            }
        }
    },
    {
        method: 'GET',
        path: '/v1/registration/expires',
        handler: async (request, h) => {
            const logger = request.server.app.logger;
            const { username, domain } = request.query;
            logger.info(`Fetching registration expiration for username: ${username} domain: ${domain}`);
            const uow = await request.app.getNewUoW();
            try {
                const expiration = await uow.locationsRepository.getRegistrationExpiration(username, domain);
                return expiration || null;
            } catch (err) {
                logger.error(err);
                logger.error('Error fetching registration expiration');
                return Boom.badImplementation('Error fetching registration expiration');
            }
        },
        options: {
            auth: false,
            validate: {
                query: {
                    username: Joi.string().optional(),
                    domain: Joi.string().optional()
                }
            }
        }
    }
]
