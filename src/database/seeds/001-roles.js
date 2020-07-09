exports.seed = (knex) => {
  return knex("roles").insert([{ title: "Staff" }, { title: "Volunteer" }]);
};
