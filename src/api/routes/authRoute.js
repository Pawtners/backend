const router = require("express").Router();
const passport = require("passport");
const Auth = require("../controllers/authController");

const { handleResponse } = require("../utils");

function isLoggedIn(req, res, next) {
  console.log("isLoggedIn", req.isAuthenticated());
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
  console.log(
    "hitting users endpoint",
    req.session,
    "isAuthenticated()",
    req.isAuthenticated()
  );
  const users = await Auth.getUsers();
  handleResponse(res, 200, users);
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
    console.log("Login info", info);
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

// For debugging
// router.post(
//   "/login",
//   // wrap passport.authenticate call in a middleware function
//   function (req, res, next) {
//     // call passport authentication passing the "local" strategy name and a callback function
//     passport.authenticate("local", function (error, user, info) {
//       // this will execute in any case, even if a passport strategy will find an error
//       // log everything to console
//       console.log(error);
//       console.log(user);
//       console.log(info);

//       if (error) {
//         res.status(401).send(error);
//       } else if (!user) {
//         res.status(401).send(info);
//       } else {
//         next();
//       }

//       res.status(401).send(info);
//     })(req, res);
//   },

//   // function to call once successfully authenticated
//   function (req, res) {
//     res.status(200).send("logged in!");
//   }
// );

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
    }
  });
});

// Provider Logins

module.exports = router;
