const db = require("../../database/dbConfig");
const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require("passport-google-oauth20").OAuth2Strategy;
const { comparePass } = require("../controllers/authController");

module.exports = (passport) => {
  passport.use(
    new LocalStrategy(
      { usernameField: "email", passwordField: "password" },
      (email, password, done) => {
        // check to see if the username exists
        console.log("HIT LOCAL STRATEGY");
        db("users")
          .where({ email })
          .first()
          .then((user) => {
            console.log("LOCAL STRATEGY USER", user);
            if (!user) {
              return done(null, false, {
                message: "That email is not registered",
              });
            }
            if (comparePass(password, user.password)) {
              return done(null, user);
            } else {
              return done(null, false);
            }
          })
          .catch((err) => {
            console.log("ERROR Local Strategy", err);
            return done(err);
          });
      }
    )
  );

  passport.serializeUser((user, done) => {
    console.log("serializer called", user);
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    console.log("deserializer called", id);
    const user = await db("users").where({ id }).first();
    try {
      done(null, user);
    } catch (err) {
      console.log(err);
    }
  });
};
