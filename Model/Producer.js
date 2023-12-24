const mongoose = require("mongoose");


const producerSchema = new mongoose.Schema({
    Name:{
        type:String,
        required:true
    },
    Gender:{
        type:String,
        enum:["Male","Female","Other"],
        required:true
    },
    DOB:{
        type:Date,
        required:true
    },
    Bio:{
        type:String,
        required:true
    },
    Movies:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"movies"
    }]

})

const Producer = mongoose.model("producers",producerSchema)

module.exports = Producer