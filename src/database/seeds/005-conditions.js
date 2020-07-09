exports.seed = (knex) => {
  return knex("conditions").insert([
    { name: "URI" },
    { name: "Kennel Cough" },
    { name: "Dental" },
    { name: "Medical Monitoring" },
    { name: "Litterbox Monitoring" },
    { name: "No Cats" },
    { name: "Pregnant" },
    { name: "Adult Only Home" },
    { name: "Kids 12+" },
    { name: "Kids 6+" },
    { name: "Ringworm" },
    { name: "Waiting for Surgery" },
    { name: "Recovery" },
    { name: "Other" },
    { name: "None" },
  ]);
};
