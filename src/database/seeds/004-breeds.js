exports.seed = (knex) => {
  return knex("breed").insert([
    { name: "Short-haired" },
    { name: "Long-haired" },
    { name: "Medium-haired" },
    { name: "Husky" },
    { name: "Labrador" },
    { name: "Shepherd" },
    { name: "Pitbull" },
    { name: "Mixed Breed" },
    { name: "Other" },
  ]);
};
