if (!process.env.REDIS_PREFIX) {
    throw new Error('REDIS_PREFIX is required!');
}
const options = {
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: Number(process.env.REDIS_PORT || 6379),
    db: 1,
    keyPrefix: process.env.REDIS_PREFIX,
};

module.exports = {
    options,
    usersTtl: Number(process.env.REDIS_USER_TTL || 10800), // three hour (in seconds)
    ttl: Number(process.env.REDIS_TTL || 86400), // one day
};
