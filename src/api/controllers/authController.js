const bcrypt = require("bcryptjs");
const db = require("../../database/dbConfig");
const { handleResponse } = require("../utils");

function comparePass(userPassword, databasePassword) {
  console.log(
    "comparePass result",
    bcrypt.compareSync(userPassword, databasePassword)
  );
  return bcrypt.compareSync(userPassword, databasePassword);
}

const createUser = async (req, res) => {
  // local user || 3rd party provider
  const { email, password, firstName, lastName, roleId, googleId, facebookId } =
    req.body || req;
  let hash = null;

  // checks for local user
  if (req.body) {
    hash = bcrypt.hashSync(password, 10);

    if (!email || !password || !firstName || !lastName) {
      handleResponse(res, 400, "Please ensure all fields are complete");
    }

    // check to see if user exists
    try {
      const user = await getUserByEmail(email);

      if (user) {
        // local auth account exists
        if (user.password) {
          handleResponse(res, 400, "User already exists");
        } else {
          // user exists but no local auth, link accounts
          return db("users")
            .where({ email: email })
            .update(
              { password: hash, firstName: firstName, lastName: lastName },
              ["id", "firstName", "lastName"]
            );
        }
      }
    } catch (err) {
      console.log({ error: err });
    }
  }
  console.log("TEST TEST");
  // no existing user, add
  try {
    console.log("No existing user");
    const [id] = await db("users").insert(
      {
        email: email,
        password: hash,
        firstName: firstName,
        lastName: lastName,
        roleId: roleId || 2,
        createdAt: Date.now(),
        googleId: googleId || null,
        facebookId: facebookId || null,
      },
      "id"
    );

    return getUser(id);
  } catch (err) {
    console.log("ERROR from createUser", err);
    return { error: err };
  }
};

const getUser = async (id) => {
  const user = await db("users").where({ id }).first();
  console.log(user);
  return user;
};

const getUserByEmail = async (email) => {
  const user = await db("users").where({ email }).first();
  return user;
};

const getUsers = async () => {
  const users = await db("users");
  return users;
};

module.exports = { comparePass, createUser, getUsers, getUser, getUserByEmail };
