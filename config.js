module.exports = {
    server: {
        port: process.env.SERVER_PORT || 3000
    },
    jsonSecret: process.env.JSON_SECRET || '15e4baac-b533-4835-8a44-d63602b884a3',
    jwtValidTimespan: process.env.JWT_TIMESPAN || '12h',
    localTimezone: process.env.TIMEZONE || 'America/New_York',
    logLevel: process.env.LOG_LEVEL || 'info',
    logDirectory: process.env.LOG_DIRECTORY || 'logs',
    database: {
        client: process.env.DATABASE_CLIENT || 'pg',
        connection: {
            database: process.env.DATABASE_NAME || 'kamailio',
            host: process.env.DATABASE_HOST || 'kamailio-api-postgres',
            port: process.env.DATABASE_PORT || '5432',
            user: process.env.DATABASE_USER || 'kamailio',
            password: process.env.DATABASE_PASS || 'kamailio',
        }
    },
    redis: {
        host: process.env.REDIS_URL || 'kamailio-api-redis',
        port: process.env.REDIS_PORT || 6379
    },
    logObfuscation: {
        properties: process.env.LOG_OBFUSCATION_PROPERTIES || ['password', 'confirmPassword', 'secretKey'],
        mask: process.env.LOG_OBFUSCATION_MASK || '**********'
    },
};