const db = require("../../database/dbConfig");

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

    console.log("conditions", conditions);

    // if no conditions, return empty array
    if (!conditions.length) {
      return conditions;
    } else {
      const name = conditions[0].name;
      const justConditions = conditions.map(
        (c) => (c = { animalConditionId: c.id, condition: c.condition })
      );
      return { animalId: animalId, name: name, conditions: justConditions };
    }
  } catch (err) {
    console.log(err);
    return { error: err };
  }
};

const deleteConditionFromAnimal = async (animalConditionId) => {
  try {
    const animal = await db("animalConditions")
      .where({ id: animalConditionId })
      .select("animalId");

    const animalId = animal[0].animalId;

    const deleted = await db("animalConditions")
      .where({ id: animalConditionId })
      .del();

    const conditionsLeft = await getConditionsForAnimal(animalId);

    return conditionsLeft;
  } catch (err) {
    console.log(err);
    return { error: err };
  }
};

module.exports = {
  addConditionsToAnimal,
  getConditionsForAnimal,
  deleteConditionFromAnimal,
};
