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
        path: "ProducerName",
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

// getting actor ids
const getActorIds = async (Actors) => {
  try {
    const actorObjectIds = await Promise.all(
      Actors.map(async (name) => {
        const actor = await Actor.findOne({ Name: name });
        if (actor) {
          return actor._id;
        }
      })
    );
    return actorObjectIds;
  } catch (error) {
    console.error("Error fetching actor IDs:", error);
    throw error;
  }
};

// Post router for adding new movie
router.post("/add", async (req, res) => {
  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      const { Name, YearOfRelease, Plot, Poster, Actors, ProducerName } =
        req.body;

      if (!Name || !YearOfRelease || !Plot || !Poster || !Actors || !Producer) {
        return res.status(400).json({ message: "Please provide all details." });
      }

      const actorIds = await getActorIds(Actors);
      const producerId = await Producer.findOne({ Name: ProducerName });

      const existingMovie = await Movie.findOne({ Name });
      if (existingMovie) {
        return res.status(400).json({ message: "Movie name already exists." });
      }

      const newMovie = await Movie.create({
        Name,
        YearOfRelease,
        Plot,
        Poster,
        Actors: actorIds,
        ProducerName: producerId._id,
      });

      await Actor.updateMany(
        { _id: { $in: actorIds } },
        { $push: { Movies: newMovie._id } },
        { session }
      );

      await Producer.findByIdAndUpdate(
        producerId._id,
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
