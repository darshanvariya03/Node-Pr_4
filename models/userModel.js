const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name:{
        type : String,
        require : true
    },
    price:{
        type : String,
        require : true
    },
    pages:{
        type : Array,
        require : true
    },
    author:{
        type : String,
        require : true
    },
    image:{
        type : String,
        require : true
    }
})

const user = mongoose.model('user',userSchema);

module.exports = user;