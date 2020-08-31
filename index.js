const { Server } = require('@reperio/hapijs-starter');
const API = require('./api');
const Config = require('./config');
const { knex } = require('./db/connect');
const RedisHelper = require('./helpers/redisHelper');
const extensions = require('./extensions');

const checkRedisForJWT = async (decodedToken, request) => {
    try {
        const redisHelper = new RedisHelper(request.server.app.logger, Config);
        const redisToken = await redisHelper.getJWT(request.auth.token);

        return { isValid: !!redisToken };
    } catch (e) {
        console.log(e);
        return { isValid: false }
    }
};

const start = async function () {
    try {
        //status monitor is turned off due to dependency issue with the pidusage dependency on the master branch of hapijs-status-monitor
        const reperio_server = new Server({
            statusMonitor: true,
            cors: true,
            corsOrigins: ['*'],
            accessControlAllowHeaders: 'Content-Type, Authorization, x-organization-id',
            authEnabled: true,
            authSecret: Config.jsonSecret,
            authValidateFunc: checkRedisForJWT,
            port: Config.server.port,
            hapiServerOptions: {
                routes: {
                    validate: {
                        failAction: (request, h, err) => {
                            const logger = request.server.app.logger;
                            const correlationId = request.info.id;

                            const errorWithCorrelationId = {
                                ...err,
                                correlationId
                            };

                            logger.error('Request failed validation.', errorWithCorrelationId);
                            logger.error(`Payload: ${JSON.stringify(request.payload)}`, {
                                correlationId
                            });
                            logger.error(`Query: ${JSON.stringify(request.query)}`, {
                                correlationId
                            });

                            return err || new Error('Undefined Error');
                        }
                    }
                }
            }
        });



        const apiPluginPackage = {
            plugin: API,
            options: {},
            routes: {
                prefix: '/api'
            }
        };

        await reperio_server.configure();

        await reperio_server.registerAdditionalPlugin(apiPluginPackage);

        knex.on('query', (query) => {
            if (query.bindings) {
                for (let bind of query.bindings) {
                    query.sql = query.sql.replace('?', `'${bind}'`);
                }
            }
            reperio_server.app.logger.debug(query.sql);
        });

        reperio_server.app.config = Config;

        await extensions.registerExtensions(reperio_server);

        await reperio_server.startServer();
    } catch (err) {
        console.error(err);
    }
};

start();
