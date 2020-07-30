const router = require("express").Router();
const Conditions = require("../controllers/conditionsController");
const Animals = require("../controllers/animalsController");
const { handleResponse, validateAnimalId, checkIfStaff } = require("../utils");

router.post("/:id", checkIfStaff, validateAnimalId, async (req, res) => {
  const animalId = req.params.id;
  const { conditions } = req.body;

  if (!conditions.length) {
    return handleResponse(res, 400, {
      message: "Please include a condition.",
    });
  }

  // TODO: Validate conditions
  // 1) Make sure condition exists in conditions table
  // 2) If animal already has a condition, do not create duplicate

  try {
    const animal = await Conditions.addConditionsToAnimal(conditions, animalId);
    return handleResponse(res, 200, { animal });
  } catch (err) {
    console.log(err);
    return handleResponse(res, 500, { error: err });
  }
});

router.get("/animal/:id", validateAnimalId, async (req, res) => {
  const id = req.params.id;

  try {
    const conditions = await Conditions.getConditionsForAnimal(id);
    return handleResponse(res, 200, { conditions });
  } catch (err) {
    console.log(err);
    return handleResponse(res, 500, { error: err });
  }
});

router.delete("/:id", async (req, res) => {
  const id = req.params.id;

  // TODO: validate condition

  try {
    const conditionsLeft = await Conditions.deleteConditionFromAnimal(id);
    return handleResponse(res, 200, {
      message: `Deleted condition id ${id}`,
      conditionsLeft,
    });
  } catch (err) {
    console.log(err);
    return handleResponse(res, 500, { error: err });
  }
});

module.exports = router;
