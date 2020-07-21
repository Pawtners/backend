const db = require("../../database/dbConfig");
const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
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
        callbackURL: `${process.env.SERVER_API_URL}/auth/google/redirect`,
      },

      async function (accessToken, refreshToken, profile, done) {
        const { id, name, emails } = profile;
        const email = emails[0].value;
        try {
          // check if user exists using email
          let user = await db("users").where("email", email).first();
          console.log("User", user);

          // if exists and no googleId, add googleId
          if (user && user.googleId === null) {
            console.log("Adding Google ID");
            return db("users")
              .where({ email: email })
              .update({ googleId: id }, [
                "id",
                "firstName",
                "lastName",
                "googleId",
              ]);
          } else if (!user) {
            // if does not exist, create new user in db
            user = await Auth.createUser({
              firstName: name.givenName,
              lastName: name.familyName,
              email: email,
              googleId: id,
            });
          }
          return done(null, user);
        } catch (err) {
          console.log(err);
        }
      }
    )
  );

  passport.use(
    new FacebookStrategy(
      {
        clientID: keys.facebook.clientID,
        clientSecret: keys.facebook.clientSecret,
        callbackURL: `${process.env.SERVER_API_URL}/auth/facebook/callback`,
        profileFields: ["id", "email", "name"],
        enableProof: true,
      },
      async function (accessToken, refreshToken, profile, done) {
        console.log("Facebook profile", profile);
        const { id, name, emails } = profile;
        const email = emails[0].value;
        try {
          // check if user exists using email
          let user = await db("users").where("email", email).first();

          if (user && user.facebookId === null) {
            return db("users")
              .where({ email: email })
              .update({ facebookId: id }, [
                "id",
                "firstName",
                "lastName",
                "facebookId",
              ]);
          } else if (!user) {
            // if does not exist, create new user in db
            user = await Auth.createUser({
              firstName: name.givenName,
              lastName: name.familyName,
              email: email,
              facebookId: id,
            });
          }
          return done(null, user);
        } catch (err) {
          console.log(err);
        }
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
