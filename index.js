const express = require("express")
const dotenv = require("dotenv")
const cors = require("cors")
const dbConnection = require("./DB")
const actorRouter = require("./Routes/Actor.js")
const movieRouter = require("./Routes/Movie.js")
const producerRouter = require("./Routes/Producer.js")

// Dot env configuration
dotenv.config()
const PORT = process.env.PORT

// Database connection
dbConnection()

const app = express()

// Middlewares
app.use(express.json())
app.use(cors())


// Routes
app.use("/actor",actorRouter)
app.use("/movie",movieRouter)
app.use("/producer",producerRouter)

// Server
app.listen(PORT,()=>console.log(`Server listening on port no : ${PORT}`))