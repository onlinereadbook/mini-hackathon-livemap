var mongo = require('mongoskin');
var db = mongo.db("mongodb://localhost:27017/integration_tests", {native_parser:true});
db.bind('article');
db.article.find().toArray(function(err, items) {
        db.close();
});

class MongoDBManager {
    constructor(host: string, port: string, dbName: string, ...options){
        options.native_parser = true;

        this.db = mongo.db(`mongodb://${host}:${port}/${dbName}`, options);

    }

    setCollection(name: string){
        this.db.bind(name); 
    }

    insert(collection: string, query: ? object, ...options): Promise<Object>{
        return this.db[collection].insert(query, options);
    }

    findOne(collection: string, query, ...options){

    }
}

export default new MongoDBManager();