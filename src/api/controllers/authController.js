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
  const { email, password, firstname, lastname, roleId } = req.body;

  // check required fields
  if (!email || !password || !firstname || !lastname) {
    handleResponse(res, 400, "Please ensure all fields are complete");
  }

  const hash = bcrypt.hashSync(password, 10);

  try {
    const [id] = await db("users").insert(
      {
        email: email,
        password: hash,
        firstname: firstname,
        lastname: lastname,
        roleId: roleId || 2,
        createdAt: Date.now(),
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