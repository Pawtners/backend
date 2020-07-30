const db = require("../../database/dbConfig");

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

const updateAnimal = async (id, updates) => {
  try {
    const updatedAnimal = await db("animals").update(updates).where({ id });
    return getAnimal(id);
  } catch (err) {
    console.log(err);
    return { error: err };
  }
};

const deleteAnimal = async (id) => {
  try {
    const deleted = await db("animals").where({ id }).del();

    return deleted;
  } catch (err) {
    console.log(err);
    return { error: err };
  }
};

module.exports = {
  registerAnimal,
  getAnimals,
  getAnimal,
  updateAnimal,
  deleteAnimal,
};
