exports.up = function (knex, Promise) {
  return (
    knex.schema
      .createTable("roles", (table) => {
        table.increments();
        table.string("title", 128).notNullable().unique();
      })
      .createTable("users", (table) => {
        table.increments();
        table.string("googleId", 128);
        table.string("facebookId", 128);
        table.string("firstname", 128);
        table.string("lastname", 128);
        table.string("email", 128).unique().notNullable();
        table.string("password", 128);
        table
          .integer("roleId")
          .unsigned()
          .references("id")
          .inTable("roles")
          .notNullable();
        table.dateTime("createdAt").notNullable().defaultTo(knex.fn.now());
      })
      /*
    {id: 1,
     user_id: 2,
     type: 1, // species}
     value: 1 // cat
    */
      .createTable("userPreferences", (table) => {
        table.increments();
        table
          .integer("userId")
          .unsigned()
          .references("id")
          .inTable("users")
          .notNullable()
          .onDelete("CASCADE")
          .onUpdate("CASCADE");
        table.integer("type").notNullable();
        table.integer("value").notNullable();
      })
      .createTable("species", (table) => {
        table.increments();
        table.string("type").notNullable().unique();
      })
      .createTable("breed", (table) => {
        table.increments();
        table.string("name").notNullable().unique();
      })
      .createTable("animals", (table) => {
        table.increments();
        table.string("name", 128).notNullable();
        table.date("birthday");
        table.float("weight").notNullable();
        table.boolean("adopted").defaultTo(false);
        table.boolean("fostered").defaultTo(false);
        table.string("imageURL", 1000);
        table.dateTime("createdAt").notNullable().defaultTo(knex.fn.now());
        table.integer("userId").unsigned().references("id").inTable("users");
        table
          .integer("speciesId")
          .unsigned()
          .references("id")
          .inTable("species")
          .notNullable();
        table
          .integer("breedId")
          .unsigned()
          .references("id")
          .inTable("breed")
          .notNullable();
      })
      .createTable("conditions", (table) => {
        table.increments();
        table.string("name", 255).notNullable().unique();
      })
      .createTable("animalConditions", (table) => {
        table.increments();
        table
          .integer("animalId")
          .unsigned()
          .references("id")
          .inTable("animals")
          .onDelete("CASCADE")
          .onUpdate("CASCADE");
        table
          .integer("conditionId")
          .unsigned()
          .references("id")
          .inTable("conditions")
          .onDelete("CASCADE")
          .onUpdate("CASCADE");
      })
      .createTable("appointments", (table) => {
        table.increments();
        table
          .integer("animalId")
          .unsigned()
          .references("id")
          .inTable("animals")
          .notNullable()
          .onDelete("CASCADE")
          .onUpdate("CASCADE");
        table.date("date").notNullable();
        table.time("time").notNullable();
      })
      .createTable("notes", (table) => {
        table.increments();
        table.text("notes");
        table
          .integer("animalId")
          .unsigned()
          .references("id")
          .inTable("animals")
          .onDelete("CASCADE")
          .onUpdate("CASCADE");
      })
      .createTable("favoritedAnimals", (table) => {
        table.increments();
        table
          .integer("userId")
          .unsigned()
          .references("id")
          .inTable("users")
          .notNullable()
          .onDelete("CASCADE")
          .onUpdate("CASCADE");
        table
          .integer("animalId")
          .unsigned()
          .references("id")
          .inTable("animals")
          .notNullable()
          .onDelete("CASCADE")
          .onUpdate("CASCADE");
      })
  );
};

exports.down = function (knex, Promise) {
  return knex.schema
    .dropTableIfExists("favoritedAnimals")
    .dropTableIfExists("notes")
    .dropTableIfExists("appointments")
    .dropTableIfExists("animalConditions")
    .dropTableIfExists("conditions")
    .dropTableIfExists("animals")
    .dropTableIfExists("breed")
    .dropTableIfExists("species")
    .dropTableIfExists("userPreferences")
    .dropTableIfExists("users")
    .dropTableIfExists("roles");
};
