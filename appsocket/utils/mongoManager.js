/**
 * @flow
 */
import * as config from '../config';

var mongo = require('mongoskin');

class MongoDBManager {
    constructor(host: string, port: string, dbName: string, ...options){
        options.native_parser = true;
        this.host = host;
        this.port = port;
        this.dbName = dbName;

        this.db = mongo.db(`mongodb://${host}:${port}/${dbName}`, options);

    }

    setCollection(name: string){
        return this.db.bind(name); 
    }

    insert(collection: string, query: ? object, ...options): Promise<Object>{
        return new Promise((resolve, reject) => {
            this.setCollection(collection);
            this.db[collection].insert(query, options, (err, result) => {
                if(err){
                    reject(err);
                }else{
                    resolve(result);
                }
            });
        });
    }

    findOne(collection: string, query: Object, options: Object): Promise<Object>{
        return new Promise((resolve, reject) => {
            this.setCollection(collection);
            this.db[collection].findOne(query, options, (err, item) => {
                console.log(err, item);
                if(err){
                    reject(err);
                }else{
                    resolve(item);
                }
            });
        });
    }
}

const manager = new MongoDBManager(config.host, config.port, config.dbName);

export default manager;