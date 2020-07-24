const router = require("express").Router();
const Animals = require("../controllers/animalsController");
const { handleResponse } = require("../utils");

// POST

router.post("/", async (req, res) => {
  const {
    name,
    birthday,
    weight,
    adopted,
    fostered,
    imageURL,
    userId,
    speciesId,
    breedId,
  } = req.body;

  if (!name || !weight || !speciesId || !breedId) {
    return handleResponse(res, 400, {
      message:
        "Please ensure name, weight, speciesId, and breedId are all provided.",
    });
  }

  try {
    const newAnimal = await Animals.registerAnimal({
      name,
      birthday,
      weight,
      adopted: adopted || false,
      fostered: fostered || false,
      imageURL: imageURL || null,
      userId: userId || null,
      speciesId,
      breedId,
      createdAt: Date.now(),
    });

    return handleResponse(res, 200, { animal: newAnimal });
  } catch (err) {
    console.log(err);
    return handleResponse(res, 500, { error: err });
  }
});

// GET

router.get("/", async (req, res) => {
  try {
    const animals = await Animals.getAnimals();
    return res.status(200).json(animals);
  } catch (err) {
    console.log(err);
    return handleResponse(res, 500, { error: err });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const animal = await Animals.getAnimal(id);
    return res.status(200).json(animal);
  } catch (err) {
    console.log(err);
    return handleResponse(res, 500, { error: err });
  }
});

// PUT

// DELETE

router.delete(":/id", async (req, res) => {
  try {
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
