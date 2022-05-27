import Redis from 'ioredis';
import logger from "../utils/logger";

import {options} from "./../configs/redis.config";

let instance = null;

class Redisio {
    connection() {
        instance = {
            products: new Redis({...options, db: 1})
        }
        Object.assign(instance, {
            redisClient1: instance.products,
        });
    }




}

export default Redisio