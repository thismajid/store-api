import Redis from 'ioredis';
import logger from "../utils/logger";

import {options, usersTtl} from "./../configs/redis.config";

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
            hmset: (entity: any) => this.hmset(entity,name),
        } : {
            getInstance: () => instance[name],
        }
    }

    getInstance(name: string) {
        if (instance === null) {
            this.connection();
        }
        return instance[name];
    }

    hmset(inputEntity: any, model: string) {
        if (
            ['products'].includes(model)
        ) {
            let entity = inputEntity;
            let key = ``;
            let strValue = '';
            // let count = 0;

            key += `${model}:${entity.id}`;
            strValue = JSON.stringify(entity);
            // for (let x of keys[model]) {
            //     if (x.includes('.')) {
            //         if (entity[x.split('.')[0]][x.split('.')[1]]) {
            //             if (count != 0) {
            //                 this.getInstance(model).zadd(
            //                     `${model}.${x}.index`,
            //                     0,
            //                     `${entity[x.split('.')[0]][x.split('.')[1]]}:${entity.id}`
            //                 );
            //             }
            //         }
            //     } else if (entity[x]) {
            //         if (count != 0) {
            //             this.getInstance(model).zadd(
            //                 `${model}.${x}.index`,
            //                 0,
            //                 `${entity[x]}:${entity.id}`
            //             );
            //         }
            //     }
            //     count++;
            // }

            this.getInstance(model).hmset(key, { value: strValue });
            this.getInstance(model).expire(key, usersTtl);

            // entity = ``;
            // key = ``;
            // strValue = '';
        }
    }
}

export default Redisio