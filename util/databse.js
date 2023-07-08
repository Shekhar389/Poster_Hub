const mongodb=require('mongodb');
const MongoClient=mongodb.MongoClient;
let _db;
const mongoConnect=callback=>{
    MongoClient.connect('mongodb+srv://kshekhar2807:mKMIOJ2RI6Q6gawO@cluster0.gcxkevb.mongodb.net/shop?retryWrites=true&w=majority')
    .then(client=>{
        console.log("Connected");
        _db=client.db();
        callback();
        
    }).catch(err=>{
        console.log(err);
        throw err;
    });
};

const getDb=()=>{
    if(_db)
    return _db;
    throw 'No Databse Found';
};

exports.mongoConnect=mongoConnect;
exports.getDb=getDb;


