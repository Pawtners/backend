const db = require("../../database/dbConfig");
const Animals = require("../controllers/animalsController");

const addConditionsToAnimal = async (conditions, animalId) => {
  try {
    console.log(conditions);
    const conditionsToInsert = conditions.map(
      (condition) =>
        (condition = { conditionId: condition, animalId: animalId })
    );

    const addedConditions = await db("animalConditions").insert(
      conditionsToInsert,
      "id"
    );

    // return animal with conditions
    return getConditionsForAnimal(animalId);
  } catch (err) {
    console.log(err);
    return { error: err };
  }
};

const getConditionsForAnimal = async (animalId) => {
  try {
    const conditions = await db("conditions as c")
      .join("animalConditions as ac", "c.id", "ac.conditionId")
      .join("animals as a", "ac.animalId", "a.id")
      .select("c.name as condition", "a.name as name", "ac.id as id")
      .where("a.id", animalId);

    const name = conditions[0].name;
    const justConditions = conditions.map(
      (c) => (c = { animalConditionId: c.id, condition: c.condition })
    );
    return { animalId: animalId, name: name, conditions: justConditions };
  } catch (err) {
    console.log(err);
    return { error: err };
  }
};

const deleteConditionFromAnimal = async (animalId, conditionId) => {};

module.exports = {
  addConditionsToAnimal,
  getConditionsForAnimal,
};
