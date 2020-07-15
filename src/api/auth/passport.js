const db = require("../../database/dbConfig");
const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const { comparePass } = require("../controllers/authController");
const keys = require("../../config/keys");
const Auth = require("../controllers/authController");

module.exports = (passport) => {
  passport.use(
    new LocalStrategy(
      { usernameField: "email", passwordField: "password" },
      (email, password, done) => {
        // check to see if the username exists
        db("users")
          .where({ email })
          .first()
          .then((user) => {
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

  passport.use(
    new GoogleStrategy(
      {
        clientID: keys.google.clientID,
        clientSecret: keys.google.clientSecret,
        callbackURL: "http://localhost:3001/auth/google/redirect",
        // passReqToCallback: true, // allows us to pass in the req from our route (lets us check if a user is logged in or not)
      },

      async function (accessToken, refreshToken, profile, done) {
        console.log("Google profile", profile);
        const { id, name, emails, photos } = profile;
        console.log(emails[0].value);
        // check if user exists using email
        const user = await db("users").where("email", emails[0].value).first();
        console.log("User", user);
        // if exists and no googleId, add googleId
        if (user && user.googleId === null) {
          user.googleId = profile.id;
        } else {
          // if does not exist, create new user in db
          user = await Auth.createUser({
            firstname: name.givenName,
            lastname: name.familyName,
            email: emails[0].value,
          });
        }
        // return done(null, user);
        return done(null, user);
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
