const router = require("express").Router();
const passport = require("passport");
const Auth = require("../controllers/authController");

const { handleResponse } = require("../utils");

// Register
router.get("/register", (req, res) => {
  res.send("Register route is working");
});

router.get("/users", async (req, res) => {
  const users = await Auth.getUsers();
  if (req.isAuthenticated()) {
    console.log("Authenticated", req.isAuthenticated());
    handleResponse(res, 200, users);
  } else {
    handleResponse(res, 400, `Not authenticated`);
  }
});

router.post("/register", async (req, res) => {
  const user = await Auth.createUser(req, res);
  try {
    console.log("USER FROM POST", user);
    if (user) {
      handleResponse(res, 200, `You are now registered and can log in`);
    }
  } catch (err) {
    console.log("ERROR from /register POST", err);
    handleResponse(res, 500, `${err}`);
  }
});

// Login
router.post("/login", (req, res, next) => {
  passport.authenticate("local", function (err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return handleResponse(res, 400, "Login failed");
    }
    return handleResponse(res, 200, `Login successful`);
  })(req, res, next);
});

// Provider Logins

module.exports = router;
