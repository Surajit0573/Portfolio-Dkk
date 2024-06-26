const mongoose = require('mongoose');

const homeSchema = new mongoose.Schema({
    type: {
        type: String,
        required : true,
    },
    description: {
        type: String,
        required : true,
    },
    priority:{
        type:Number,
        required:true
    },
    year:{
        type:Number,    
    }
})

const Home = mongoose.model("Home", homeSchema);

module.exports = Home;