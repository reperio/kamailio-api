const Joi = require('joi');
const Boom = require('boom');
const config = require('../config');
const uuid = require('uuid/v4');

module.exports = [
    {
        method: 'GET',
        path: '/v1/subscribers',
        handler: async (request, h) => {
            const logger = request.server.app.logger;
            logger.debug('Getting subscribers');
            const uow = await request.app.getNewUoW();
            try {
                const subscribers = await uow.subscribersRepository.getAllSubscribers();
                return subscribers || {};
            } catch (err) {
                logger.error(err);
                logger.error('Error fetching subscribers');
                return Boom.badImplementation('Error fetching subscribers');
            }
        },
        options: {
            auth: false
        }
    },
    {
        method: 'GET',
        path: '/v1/subscribers/{id}',
        handler: async (request, h) => {
            const logger = request.server.app.logger;
            const { id } = request.params;
            logger.info(`Getting subscriber: ${id}`);
            const uow = await request.app.getNewUoW();
            const subscriber = await uow.subscribersRepository.getSubscriberById(id);
            try {
                try {
                    if (!subscriber) {
                        throw Error(`Subscriber: ${id} does not exist!`);
                    }
                } catch (err) {
                    logger.error(err);
                    logger.error(`Error getting subscriber: ${id}`);
                    return Boom.notFound(err.message);
                }
                return subscriber;
            } catch (err) {
                logger.error(err);
                logger.error('Error fetching subscribers');
                return Boom.badImplementation(`Error fetching subscriber with id: ${id}`);
            }
        },
        options: {
            auth: false,
            validate: {
                params: {
                    id: Joi.string().uuid().required()
                }
            }
        }
    },
    {
        method: 'GET',
        path: '/v1/subscriber',
        handler: async (request, h) => {
            const logger = request.server.app.logger;
            const { username, domain, id } = request.query;
            logger.info(`Getting subscriber: username: ${username} domain: ${domain} id: ${id}`);
            const uow = await request.app.getNewUoW();
            let subscriber = null;
            if (id && id.length() > 0) {
                subscriber = await uow.subscribersRepository.getSubscriberById(id);
            } else if (username && username.length > 0 && domain && domain.length > 0) {
                subscriber = await uow.subscribersRepository.getSubscriberByUsernameAndDomain(username, domain);
            }

            try {
                try {
                    if (!subscriber) {
                        throw Error(`Subscriber does not exist!`);
                    }
                } catch (err) {
                    logger.error(err);
                    logger.error(`Error getting subscriber`);
                    return Boom.notFound(err.message);
                }
                return subscriber;
            } catch (err) {
                logger.error(err);
                logger.error('Error fetching subscribers');
                return Boom.badImplementation(`Error fetching subscriber`);
            }
        },
        options: {
            auth: false,
            validate: {
                query: {
                    id: Joi.string().uuid().optional(),
                    username: Joi.string().optional(),
                    domain: Joi.string().optional()
                }
            }
        }
    },
    {
        method: 'DELETE',
        path: '/v1/subscribers/{id}',
        handler: async (request, h) => {
            const logger = request.server.app.logger;
            const { id } = request.params;
            logger.info(`Removing subscriber with id: ${id}`);
            const uow = await request.app.getNewUoW();
            const subscriber = await uow.subscribersRepository.getSubscriberById(id);
            try {
                try {
                    if (!subscriber) {
                        throw Error(`Subscriber: ${id} does not exist!`);
                    }
                } catch (err) {
                    logger.error(err);
                    logger.error(`Error getting subscriber: ${id}`);
                    return Boom.notFound(err.message);
                }
                await uow.subscribersRepository.removeSubscriberById(id);
                return {
                    meta: {
                        success: true
                    }
                };
            } catch (err) {
                logger.error(err);
                logger.error('Error fetching subscribers');
                return Boom.badImplementation(`Error removing subscriber with id: ${id}`);
            }
        },
        options: {
            auth: false,
            validate: {
                params: {
                    id: Joi.string().uuid().required()
                }
            }
        }
    },
    {
        method: 'POST',
        path: '/v1/subscribers',
        handler: async (request, h) => {
            let subscriberId = request.payload.id
            if (!subscriberId) {
                subscriberId = uuid();
            }
            const logger = request.server.app.logger;
            logger.debug(`Creating subscriber with id: ${subscriberId}`);
            const uow = await request.app.getNewUoW();
            try {
                try {
                    const subscriberExists = await uow.subscribersRepository.getSubscriberById(subscriberId)
                    if (subscriberExists) {
                        throw Error(`Subscriber with id: ${subscriberId} already exists`);
                    }
                } catch (err) {
                    logger.error(err.toString());
                    return Boom.badData(err.message);
                }
                try {
                    const usernameAndDomainExists = await uow.subscribersRepository.getSubscriberByUsernameAndDomain(request.payload.username, request.payload.domain)
                    if (usernameAndDomainExists) {
                        throw Error(`Subscriber with username: ${request.payload.username} and domain: ${request.payload.domain} already exists`);
                    }
                } catch (err) {
                    logger.error(err.toString());
                    return Boom.badData(err.message);
                }
                const subscriber = await uow.subscribersRepository.createSubscriber(subscriberId, request.payload.username, request.payload.domain, { password: request.payload.password || null });
                return {
                    data: {
                        subscriber
                    },
                    meta: {
                        success: true
                    }
                };
            } catch (err) {
                logger.error(err.toString());
                return Boom.badImplementation(err.message);
            }
        },
        options: {
            auth: false,
            validate: {
                payload: {
                    id: Joi.string().uuid().optional(),
                    username: Joi.string().required(),
                    domain: Joi.string().required(),
                    password: Joi.string().optional()
                }
            }
        }
    }
]
