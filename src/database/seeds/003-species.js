exports.seed = (knex) => {
  return knex("species").insert([
    { type: "Cat" },
    { type: "Dog" },
    { type: "Rabbit" },
    { type: "Small Rodent" },
    { type: "Other" },
  ]);
};
