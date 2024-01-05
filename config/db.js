const mongoose = require('mongoose');

mongoose.connect("mongodb://127.0.0.1/Crud1");

const db = mongoose.connection;

db.on("connected",(err)=>{
    if(err){
        console.log("db is note start"+err);
        return false;
    }
    console.log('Db is start');
})

module.exports = db;