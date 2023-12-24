const mongoose = require("mongoose");


const movieSchema = new mongoose.Schema({
    Name:{
        type:String,
        required:true,
        unique:true
    },
    YearOfRelease:{
        type:Number,
        required:true
    },
    Plot:{
        type:String,
        required:true
    },
    Poster:{
        type:String,
        required:true
    },
    Actors:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"actors"
    }],
    ProducerName:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "producers"
    }

})

const Movie = mongoose.model("movies",movieSchema)

module.exports = Movie