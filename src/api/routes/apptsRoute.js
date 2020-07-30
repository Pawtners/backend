const router = require("express").Router();
const Appts = require("../controllers/apptsController");
const Animals = require("../controllers/animalsController");
const { handleResponse, validateAnimalId, checkIfStaff } = require("../utils");

// POST

router.post("/", checkIfStaff, async (req, res) => {
  const { animalId, date, time } = req.body;
  console.log(req.body);

  if (!animalId || !date || !time) {
    return handleResponse(res, 400, {
      message: "Please ensure animalId, date, and time are all provided.",
    });
  }

  try {
    const animal = await Animals.getAnimal(animalId);

    if (animal) {
      const appt = await Appts.addAppt(req.body);
      return handleResponse(res, 200, { appt });
    }
  } catch (err) {
    console.log(err);
    return handleResponse(res, 500, { error: err });
  }
});

// GET

router.get("/", async (req, res) => {
  try {
    const appts = await Appts.getAppts();
    return res.status(200).json(appts);
  } catch (err) {
    console.log(err);
    return handleResponse(res, 500, { error: err });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const appts = await Appts.getAppt(id);
    return res.status(200).json(appts);
  } catch (err) {
    console.log(err);
    return handleResponse(res, 500, { error: err });
  }
});

// PUT

router.put("/:id", async (req, res) => {
  const id = req.params.id;
  const updates = req.body;

  try {
    const updatedAppt = await Appts.updateAppt(id, updates);
    return handleResponse(res, 200, { updated: updatedAppt });
  } catch (err) {
    console.log(err);
    return handleResponse(res, 500, { error: err });
  }
});

module.exports = router;
