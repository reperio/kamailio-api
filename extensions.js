const jwt = require('jsonwebtoken');
const UnitOfWork = require('./db');
const Config = require('./config');
const os = require('os');
const PermissionService = require('./services/permissionService');

const filterProperties = async (oldObj, propertiesToObfuscate, replacementText) => {
    const obj = {...oldObj};
    for(const key in obj) {
        if (propertiesToObfuscate.includes(key)) {
            obj[key] = replacementText;
        } else if (Array.isArray(obj[key])) {
            obj[key] = await Promise.all(obj[key].map(entry => filterProperties(entry, propertiesToObfuscate, replacementText)));
        } else if (typeof obj[key] === 'object') {
            obj[key] = await filterProperties(obj[key], propertiesToObfuscate, replacementText);
        }
    }
    return obj;
};

const extensions = {
    onRequest: {
        type: 'onRequest',
        method: async (request, h) => {
            request.app.uows = [];

            request.app.getNewUoW = async () => {
                const uow = new UnitOfWork(request.server.app.logger);
                request.app.uows.push(uow);
                return uow;
            };

            return h.continue;
        }
    },
    onPostAuth: {
        type: "onPostAuth",
        method: async (request, h) => {
            if (request.auth.isAuthenticated) {
                request.app.currentUserId = request.auth.credentials.currentUserId;
            }

            let requiredPermissions = null;
            if (request.route.settings.plugins.requiredPermissions) {
                requiredPermissions = typeof request.route.settings.plugins.requiredPermissions === "function"
                    ? request.route.settings.plugins.requiredPermissions(request)
                    : request.route.settings.plugins.requiredPermissions
            }

            if (requiredPermissions) {
                const userId = request.app.currentUserId;
                const organizationId = request.headers['x-organization-id'];
                if (!userId) {
                    const response = h.response('forbidden');
                    response.statusCode = 403;
                    response.message = 'Request missing userId from JWT';
                    return response.takeover();
                }
                if (!organizationId) {
                    const response = h.response('forbidden');
                    response.statusCode = 403;
                    response.message = 'Request missing organizationId (or orgId) from params, payload, or query';
                    return response.takeover();
                }
                const uow = await request.app.getNewUoW();

                // Check for super admin
                const userCorePermissions = request.auth.credentials.userPermissions;
                if (PermissionService.userHasRequiredPermissions(userCorePermissions, ['UpdateOrganizations'])) {
                    // user is super admin
                    return h.continue;
                }

                const userPermissions = (await uow.usersRepository.getUserPermissionsForOrganization(userId, organizationId)).map(p => p.permissionName);

                if (!PermissionService.userHasRequiredPermissions(userPermissions, requiredPermissions)) {
                    const response = h.response('forbidden');
                    response.statusCode = 403;
                    response.message = 'User does not have required permissions for this route';
                    return response.takeover();
                }
            }

            return h.continue;
        }
    },
    onPreResponse: {
        type: "onPreResponse",
        method: async (request, h) => {

            if (request.app.currentUserId != null && request.response.header != null) {

                const tokenPayload = {
                    currentUserId: request.app.currentUserId
                };

                const token = jwt.sign(tokenPayload, Config.jsonSecret, {
                    expiresIn: Config.jwtValidTimespan
                });

                request.response.header('Access-Control-Expose-Headers', 'Authorization');
                request.response.header("Authorization", `Bearer ${token}`);
            }

            return h.continue;
        }
    },
    onPreHandlerActivityLogging: {
        type: 'onPreHandler',
        method: async (request, h) => {
            const meta = {
                request: {
                    id: request.info.id,
                    params: request.params,
                    query: request.query,
                    payload: request.payload,
                    path: request.url.path,
                    method: request.url.method,
                    remoteAddress: request.info.remoteAddress
                },
                userId: request.app.currentUserId || null,
                hostname: os.hostname()
            };

            const filteredMeta = await filterProperties(meta, Config.logObfuscation.properties, Config.logObfuscation.mask);
            await request.server.app.activityLogger.info('new request', filteredMeta);

            return h.continue;
        }
    },
    onPreResponseActivityLogging: {
        type: 'onPreResponse',
        method: async (request, h) => {
            const meta = {
                request: {
                    id: request.info.id
                }
            };

            if (request.response.statusCode >= 400 && request.response.statusCode < 500) {
                meta.response = request.response.source;
            }

            const filteredMeta = await filterProperties(meta, Config.logObfuscation.properties, Config.logObfuscation.mask);
            await request.server.app.activityLogger.info('finished request', filteredMeta);

            return h.continue;
        }
    }
}

const registerExtensions = async (server) => {
    await server.registerExtension(extensions.onRequest);
    await server.registerExtension(extensions.onPostAuth);
    await server.registerExtension(extensions.onPreResponse);
    await server.registerExtension(extensions.onPreHandlerActivityLogging);
    await server.registerExtension(extensions.onPreResponseActivityLogging);
}

module.exports = { extensions, registerExtensions };
