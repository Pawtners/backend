const db = require("../../database/dbConfig");
const { handleResponse } = require("../utils");

const getAnimals = async () => {
  const animals = await db("animals");
  return animals;
};

const getAnimal = async (id) => {
  const animal = await db("animals").where({ id });
  return animal;
};

const registerAnimal = async (animalInfo) => {
  try {
    const [id] = await db("animals").insert(animalInfo, "id");
    return getAnimal(id);
  } catch (err) {
    console.log(err);
    return { error: err };
  }
};

module.exports = {
  registerAnimal,
  getAnimals,
  getAnimal,
};
