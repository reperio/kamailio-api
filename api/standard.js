const Joi = require('joi');
const Boom = require('boom');
const config = require('../config');

// currently just a test API file
module.exports = [
    {
        method: 'GET',
        path: '/v1/',
        options: {
            auth: false,
        },
        handler: async (request, h) => {
            try {
                const logger = request.server.app.logger;
                logger.info('Standard Route Working');
                return 'Welcome to the Kamailio API';
            } catch (err) {
                logger.error(err);
                logger.error('Standard Route Failed');
                return Boom.badImplementation();
            }
        }
    }
]