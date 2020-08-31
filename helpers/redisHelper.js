const redis = require("redis");
const {promisify} = require("util");
const Config = require('../config');

class RedisHelper {
    constructor(logger, config) {
        this.logger = logger;
        this.config = config;

        this.redisClient = redis.createClient(this.config.redis);

        this.asyncRedisClient = {
            get: promisify(this.redisClient.get).bind(this.redisClient)
        };
    }

    async getJWT(jwt) {
        const redisKeyName = `jwt:${jwt}`;
        return await this.asyncRedisClient.get(redisKeyName);
    }
}

module.exports = RedisHelper;