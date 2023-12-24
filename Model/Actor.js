const mongoose = require("mongoose");


const actorSchema = new mongoose.Schema({
    Name:{
        type:String,
        unique:true,
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

const Actor = mongoose.model("actors",actorSchema)

module.exports = Actor