const db = require("../../database/dbConfig");

const addAppt = async (info) => {
  try {
    const [id] = await db("appointments").insert(info, "id");
    return getAppt(id);
  } catch (err) {
    console.log(err);
    return { error: err };
  }
};

const getAppts = async () => {
  const appts = await db("appointments as a")
    .join("animals", "a.animalId", "animals.id")
    .join("species as s", "s.id", "animals.speciesId")
    .join("breed as b", "b.id", "animals.breedId")
    .select(
      "a.id as id",
      "a.animalId",
      "a.date",
      "a.time",
      "animals.name",
      "animals.birthday",
      "animals.weight",
      "s.type as species",
      "b.name as breed"
    );

  return appts;
};

const getAppt = async (id) => {
  const appt = await db("appointments as a")
    .join("animals", "a.animalId", "animals.id")
    .join("species as s", "s.id", "animals.speciesId")
    .join("breed as b", "b.id", "animals.breedId")
    .select(
      "a.id as id",
      "a.animalId",
      "a.date",
      "a.time",
      "animals.name",
      "animals.birthday",
      "animals.weight",
      "s.type as species",
      "b.name as breed"
    )
    .where({ "a.id": id });

  return appt;
};

const getApptByAnimal = async (animalId) => {
  const appt = await db("appointments as a")
    .join("animals", "a.animalId", "animals.id")
    .join("species as s", "s.id", "animals.speciesId")
    .join("breed as b", "b.id", "animals.breedId")
    .select(
      "a.id as id",
      "a.animalId",
      "a.date",
      "a.time",
      "animals.name",
      "animals.birthday",
      "animals.weight",
      "s.type as species",
      "b.name as breed"
    )
    .where({ "animals.id": animalId });

  return appt;
};

const updateAppt = async (id, updates) => {
  try {
    const updatedAppt = await db("appointments").update(updates).where({ id });
    return getAppt(id);
  } catch (err) {
    console.log(err);
    return { error: err };
  }
};

const deleteAppt = async (id) => {
  try {
    const deleted = await db("appointments").where({ id }).del();

    return deleted;
  } catch (err) {
    console.log(err);
    return { error: err };
  }
};

module.exports = {
  addAppt,
  getAppts,
  getAppt,
  getApptByAnimal,
  updateAppt,
  deleteAppt,
};
