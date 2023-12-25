const { default: mongoose } = require("mongoose");
const Actor = require("../Model/Actor");
const Movie = require("../Model/Movie");
const Producer = require("../Model/Producer");

const router = require("express").Router();

// Get router for getting details about movie
router.get("/get", async (req, res) => {
  try {
    const { id } = req.query;

    let moviesQuery = Movie.find();

    if (id) {
      moviesQuery = Movie.findById(id);
    }

    const movies = await moviesQuery
      .populate({
        path: "Actors",
        select: "_id Name",
        model: Actor,
      })
      .populate({
        path: "Producer",
        select: "_id Name",
        model: Producer,
      })
      .exec();

    if (!movies) {
      return res.status(404).json({ message: "movie not found." });
    }

    // Return the movie details if found
    return res
      .status(200)
      .json({ message: "movie details retrieved successfully", movies });
  } catch (error) {
    console.error("Error getting movie:", error);
    return res
      .status(500)
      .json({ message: "An error occurred while getting the movie details." });
  }
});

// Post router for adding new movie
router.post("/add", async (req, res) => {
  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      const { Name, YearOfRelease, Plot, Poster, Actors, ProducerId } =
        req.body;

      if (!Name || !YearOfRelease || !Plot || !Poster || !Actors || !Producer) {
        return res.status(400).json({ message: "Please provide all details." });
      }

      const existingMovie = await Movie.findOne({ Name });
      if (existingMovie) {
        return res.status(400).json({ message: "Movie name already exists." });
      }

      const newMovie = await Movie.create({
        Name,
        YearOfRelease,
        Plot,
        Poster,
        Actors,
        Producer:ProducerId
      });

      await Actor.updateMany(
        { _id: { $in: Actors } },
        { $push: { Movies: newMovie._id } },
        { session }
      );

      await Producer.findByIdAndUpdate(
        ProducerId,
        { $push: { Movies: newMovie._id } },
        { session }
      );

      res
        .status(201)
        .json({ message: "movie added successfully", movie: newMovie });
    });
  } catch (error) {
    console.error("Error adding movie:", error);
    return res
      .status(500)
      .json({ message: "An error occurred while adding the movie." });
  } finally {
    session.endSession();
  }
});

module.exports = router;
