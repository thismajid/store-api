import Redis from 'ioredis';
import logger from "../utils/logger";

import {options, usersTtl} from "./../configs/redis.config";

let instance: any = null;

class Redisio {
    constructor(name: string) {
        this.getInstance(name)

    }

    connection() {
        instance = {
            products: new Redis({...options, db: 7})
        }
        Object.assign(instance, {
            redisClient1: instance.products,
        });
    }

    // model(name = ""){
    //     if(!instance.name){
    //         this.connection();
    //     }
    //
    //     return name ? {
    //         hmset: (entity: any) => this.hmset(entity,name),
    //     } : {
    //         getInstance: () => instance[name],
    //     }
    // }

    getInstance(name: string) {
        if (instance === null) {
            this.connection();
        }
        return instance[name];
    }

    hmset(inputs: any[], model: string){
        if(['products'].includes(model)){
            let key, strValue;
            for (const input of inputs) {
                key = `${model}:${input.id}`;
                strValue = JSON.stringify(input)
                this.getInstance(model).set(key, strValue)
            }
        }
    }

    async hget(model: string, condition = {}){
        const data = [];
        let temp, keys;
        try{
             keys = await this.getInstance(model).keys("*")
            for (const key of keys) {
                temp = await this.getInstance(model).get(key.replace('cache:', ''))
                data.push(JSON.parse(temp))
            }
            return data
        }catch(err){
            logger.error(err)
        }
    }

    // hmset(inputEntity: any, model: string) {
    //     if (
    //         ['products'].includes(model)
    //     ) {
    //         let entity = inputEntity;
    //         let key = ``;
    //         let strValue = '';
    //         console.log('entity', entity)
    //         // let count = 0;
    //
    //         key += `${model}:${entity.id}`;
    //         strValue = JSON.stringify(entity);
    //         console.log("strValue", strValue)
    //         // for (let x of keys[model]) {
    //         //     if (x.includes('.')) {
    //         //         if (entity[x.split('.')[0]][x.split('.')[1]]) {
    //         //             if (count != 0) {
    //         //                 this.getInstance(model).zadd(
    //         //                     `${model}.${x}.index`,
    //         //                     0,
    //         //                     `${entity[x.split('.')[0]][x.split('.')[1]]}:${entity.id}`
    //         //                 );
    //         //             }
    //         //         }
    //         //     } else if (entity[x]) {
    //         //         if (count != 0) {
    //         //             this.getInstance(model).zadd(
    //         //                 `${model}.${x}.index`,
    //         //                 0,
    //         //                 `${entity[x]}:${entity.id}`
    //         //             );
    //         //         }
    //         //     }
    //         //     count++;
    //         // }
    //
    //         this.getInstance(model).hmset(key, { value: strValue });
    //         this.getInstance(model).expire(key, usersTtl);
    //
    //         // entity = ``;
    //         // key = ``;
    //         // strValue = '';
    //     }
    // }
}

export default Redisio