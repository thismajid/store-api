import Redis from 'ioredis';
import logger from "../utils/logger";

import {options} from "./../configs/redis.config";

let instance: any = null;

class Redisio {
    connection() {
        instance = {
            products: new Redis({...options, db: 1})
        }
        Object.assign(instance, {
            redisClient1: instance.products,
        });
    }

    model(name = ""){
        if(!instance.name){
            this.connection();
        }

        return name ? {
            hmset: (entity) => this.hmset(entity,name),
        } : {
            getInstance: () => this.instance[name],
        }
    }

}

export default Redisio