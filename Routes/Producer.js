const Movie = require("../Model/Movie");
const Producer = require("../Model/Producer");
const router = require("express").Router()


// Get router for getting details about producer
router.get("/get/:id", async (req, res) => {
    try {
      const producerId = req.params.id;
  
      // Check if the ID is provided
      if (!producerId) {
        return res.status(400).json({ message: "Provide producer ID." });
      }
  
      // Find the producer by ID in the database
      const producer = await Producer.findById(producerId)
      .populate({
         path:"Movies",
         select:"_id Name",
         model:Movie
      }).exec();
      
      if (!producer) {
        return res.status(404).json({ message: "Producer not found." });
      }
  
      // Return the producer details if found
      return res
        .status(200)
        .json({ message: "producer details retrieved successfully", producer });
    } catch (error) {
      console.error("Error getting producer:", error);
      return res
        .status(500)
        .json({ message: "An error occurred while getting the producer details." });
    }
  });
  
  // Post router for adding new producer
  router.post("/add", async (req, res) => {
    try {
      const { Name, Gender, DOB, Bio } = req.body;
  
      // Ensure all required fields are present
      if (!Name || !Gender || !DOB || !Bio) {
        return res.status(400).json({ message: "Please provide all details." });
      }
  
      // Check if the producer already exists
      const existingproducer = await Producer.findOne({ Name });
      if (existingproducer) {
          return res.status(400).json({ message: "producer name already exists." });
      }
  
      const dob = DOB.split("-");
  
      const day = parseInt(dob[0]);
      const month = parseInt(dob[1]) - 1;
      const year = parseInt(dob[2]);
  
      const dateOfBirth = new Date(Date.UTC(year, month, day));
      // Create a new producer
      const newproducer = await Producer.create({
          Name,
          Gender,
          DOB:dateOfBirth,
          Bio
      });
  
      return res.status(201).json({ message: "Producer added successfully", producer:newproducer });
    } catch (error) {
      console.error("Error adding producer:", error);
      return res
        .status(500)
        .json({ message: "An error occurred while adding the producer." });
    }
  });







module.exports = router