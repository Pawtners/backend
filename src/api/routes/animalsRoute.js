const router = require("express").Router();
const Animals = require("../controllers/animalsController");

router.post("/", async (req, res) => {});

router.get("/", async (req, res) => {
  try {
    const animals = await Animals.getAnimals();
    return res.status(200).json(animals);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const animal = await Animals.getAnimal(id);
    return res.status(200).json(animal);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});

module.exports = router;
