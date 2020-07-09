const { hashSync, genSaltSync } = require("bcryptjs");

exports.seed = (knex) => {
  return knex("users").insert([
    {
      email: "may@mailinator.com",
      password: hashSync("password", genSaltSync()),
      firstname: "May",
      lastname: "Ng",
      roleId: 1,
      createdAt: Date.now(),
    },
    {
      email: "james@mailinator.com",
      password: hashSync("password", genSaltSync()),
      firstname: "James",
      lastname: "Stuber",
      roleId: 2,
      createdAt: Date.now(),
    },
  ]);
};
