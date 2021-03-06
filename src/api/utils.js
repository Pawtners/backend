const Animals = require("./controllers/animalsController");
const Auth = require("./controllers/authController");

const handleResponse = (res, code, statusMsg) => {
  res.status(code).json({ status: statusMsg });
};

// Middleware

const validateAnimalId = async (req, res, next) => {
  const id = req.params.id;

  try {
    const animal = await Animals.getAnimal(id);

    if (animal.length) {
      next();
    } else {
      return handleResponse(res, 404, {
        message: `${id} is not a valid animal id`,
      });
    }
  } catch (err) {
    console.log(err);
    return handleResponse(res, 500, { error: err });
  }
};

const checkIfStaff = async (req, res, next) => {
  const id = req.user.id;

  try {
    const user = await Auth.getUser(id);
    if (user.roleId === 1) {
      next();
    } else {
      return handleResponse(res, 400, {
        message: `This user is not authorized for this action. Only staff members allowed.`,
      });
    }
  } catch (err) {
    console.log(err);
    return handleResponse(res, 500, { error: err });
  }
};

module.exports = { handleResponse, validateAnimalId, checkIfStaff };
