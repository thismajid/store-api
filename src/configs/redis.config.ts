if (!process.env.REDIS_PREFIX) {
    throw new Error('REDIS_PREFIX is required!');
}
const options = {
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: Number(process.env.REDIS_PORT || 6379),
    db: 1,
    keyPrefix: process.env.REDIS_PREFIX,
};

const usersTtl = Number(process.env.REDIS_USER_TTL || 10800);
const ttl = Number(process.env.REDIS_TTL || 86400);

export {
    options,
    usersTtl,
    ttl
}
