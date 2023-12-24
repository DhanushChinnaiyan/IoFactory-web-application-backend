const mongoose  = require("mongoose")
const dotenv = require("dotenv")

// Dot env configuration
dotenv.config()
const MONGODB_URL = process.env.MONGODB_URL

const dbConnection = async() => {
    try {
        await mongoose.connect(MONGODB_URL)
        console.log("Successfully db connected")
    } catch (error) {
        console.log("Mongo error",error)
    }
}

module.exports = dbConnection