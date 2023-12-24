const Actor = require("../Model/Actor");
const Movie = require("../Model/Movie");

const router = require("express").Router();

// Get router for getting details about actors
router.get("/get/:id", async (req, res) => {
  try {
    const actorId = req.params.id;

    // Check if the ID is provided
    if (!actorId) {
      return res.status(400).json({ message: "Provide actor ID." });
    }

    // Find the actor by ID in the database
    const actor = await Actor.findById(actorId)
      .populate({
        path: "Movies",
        select: "_id Name",
        model: Movie,
      })
      .exec();

    if (!actor) {
      return res.status(404).json({ message: "Actor not found." });
    }

    // Return the actor details if found
    return res
      .status(200)
      .json({ message: "Actor details retrieved successfully", actor });
  } catch (error) {
    console.error("Error getting actor:", error);
    return res
      .status(500)
      .json({ message: "An error occurred while getting the actor details." });
  }
});

// Post router for adding new actor
router.post("/add", async (req, res) => {
  try {
    const { Name, Gender, DOB, Bio } = req.body;

    // Ensure all required fields are present
    if (!Name || !Gender || !DOB || !Bio) {
      return res.status(400).json({ message: "Please provide all details." });
    }

    // Check if the actor already exists
    const existingActor = await Actor.findOne({ Name });
    if (existingActor) {
        return res.status(400).json({ message: "Actor name already exists." });
    }

    const dob = DOB.split("-");

    const day = parseInt(dob[0]);
    const month = parseInt(dob[1]) - 1;
    const year = parseInt(dob[2]);

    const dateOfBirth = new Date(Date.UTC(year, month, day));

    console.log(dateOfBirth);
    // Create a new actor
    const newActor = await Actor.create({
        Name,
        Gender,
        DOB:dateOfBirth,
        Bio
    });

    return res.status(201).json({ message: "Actor added successfully", actor:newActor });
  } catch (error) {
    console.error("Error adding actor:", error);
    return res
      .status(500)
      .json({ message: "An error occurred while adding the actor." });
  }
});

module.exports = router;
