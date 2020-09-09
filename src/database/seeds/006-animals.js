exports.seed = (knex) => {
  return knex("animals").insert([
    {
      name: "Bucket",
      birthday: "12/25/2018",
      weight: 6,
      speciesId: 1,
      breedId: 1,
      sex: "male",
    },
    {
      name: "Frank",
      birthday: "7/2/2017",
      weight: 7,
      speciesId: 1,
      breedId: 2,
      sex: "male",
    },
    {
      name: "Dinah",
      birthday: "5/13/2016",
      weight: 50,
      speciesId: 2,
      breedId: 7,
      sex: "female",
    },
  ]);
};
