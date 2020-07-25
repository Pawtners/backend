require("dotenv").config();
const router = require("express").Router();
const passport = require("passport");
const Auth = require("../controllers/authController");

const { handleResponse } = require("../utils");

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json("You must be logged in to access this");
}

// Register
router.get("/register", (req, res) => {
  res.send("Register route is working");
});

router.get("/users", isLoggedIn, async (req, res) => {
  const users = await Auth.getUsers();
  handleResponse(res, 200, users);
});

router.post("/register", async (req, res) => {
  const user = await Auth.createUser(req, res);
  try {
    if (!user.error) {
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
    // custom callback require calling req.logIn manually
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      console.log("Login isAuthenticated", req.isAuthenticated());
      return handleResponse(res, 200, `Login successful, ${user.email}`);
    });
  })(req, res, next);
});

router.get("/logout", (req, res) => {
  console.log("Logout req.user", req.user);
  req.logout();
  req.session.destroy(function (err) {
    if (!err) {
      return res
        .status(200)
        .clearCookie("connect.sid", { path: "/" })
        .json({ status: "Logged out" });
    } else {
      console.log("Couldn't destroy session");
      return handleResponse(res, 500, "Session could not be destroyed");
    }
  });
});

// Provider Logins

// GOOGLE
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

// cb route for google to redirect
router.get(
  "/google/redirect",
  passport.authenticate("google", {
    failureRedirect: `${process.env.PLATFORM_URL}/login`,
  }),
  function (req, res) {
    console.log("Google redirect");
    res.redirect(`${process.env.PLATFORM_URL}/dashboard`);
  }
);

// FACEBOOK
router.get(
  "/facebook",
  passport.authenticate("facebook", { scope: ["email"] })
);

router.get(
  "/facebook/callback",
  passport.authenticate("facebook", {
    failureRedirect: `${process.env.PLATFORM_URL}/login`,
  }),
  function (req, res) {
    console.log("Facebook redirect");
    res.redirect(`${process.env.PLATFORM_URL}/dashboard`);
  }
);

module.exports = router;
