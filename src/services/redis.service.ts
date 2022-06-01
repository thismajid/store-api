import Redis from 'ioredis';
import logger from "../utils/logger";

import {options, usersTtl} from "./../configs/redis.config";
import conditionType from "../interfaces/redis/condition.interface";

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

    hmset(inputs: any, model: string){
        if(['products'].includes(model)){
            let key
            if(Array.isArray(inputs)){
                key = `${model}`;
            } else {
                key = `${model}:${inputs.id}`;
            }
            this.getInstance(model).set(key, JSON.stringify(inputs))

        }
    }

    async hget(model: string, condition?: conditionType){
        try{
            let key = `${model}`;
            // @ts-ignore
            if(condition?.id) {
                // @ts-ignore
                key = `${model}:${condition?.id}`
            }
            const data = await this.getInstance(model).get(key);
            return JSON.parse(data)
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