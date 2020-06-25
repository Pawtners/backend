import * as Knex from "knex";

export async function up(knex: Knex): Promise<any> {
  return (
    knex.schema
      .createTable("roles", (table: any) => {
        table.increments();
        table
          .string("title", 128)
          .notNullable()
          .unique();
      })
      .createTable("users", (table: any) => {
        table.increments();
        table
          .string("username", 128)
          .unique()
          .notNullable();
        table.string("firstname", 128).notNullable();
        table.string("lastname", 128).notNullable();
        table
          .string("email", 128)
          .unique()
          .notNullable();
        table.string("password", 128).notNullable();
        table
          .integer("roleId")
          .unsigned()
          .references("id")
          .inTable("roles")
          .notNullable();
        table
          .dateTime("createdAt")
          .notNullable()
          .defaultTo(knex.fn.now());
      })
      /*
    {id: 1,
     user_id: 2,
     type: 1, // species}
     value: 1 // cat
    */
      .createTable("userPreferences", (table: any) => {
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
      .createTable("species", (table: any) => {
        table.increments();
        table
          .string("type")
          .notNullable()
          .unique();
      })
      .createTable("breed", (table: any) => {
        table.increments();
        table
          .string("name")
          .notNullable()
          .unique();
      })
      .createTable("animals", (table: any) => {
        table.increments();
        table.string("name", 128).notNullable();
        table.date("birthday");
        table.float("weight").notNullable();
        table.string("size").notNullable();
        table.boolean("adopted").defaultTo(false);
        table.boolean("fostered").defaultTo(false);
        table.string("imageURL", 1000);
        table
          .dateTime("createdAt")
          .notNullable()
          .defaultTo(knex.fn.now());
        table
          .integer("userId")
          .unsigned()
          .references("id")
          .inTable("users");
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
      .createTable("conditions", (table: any) => {
        table.increments();
        table
          .string("name", 255)
          .notNullable()
          .unique();
      })
      .createTable("animalConditions", (table: any) => {
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
      .createTable("notes", (table: any) => {
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
      .createTable("favoritedAnimals", (table: any) => {
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
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema
    .dropTableIfExists("favoritedAnimals")
    .dropTableIfExists("notes")
    .dropTableIfExists("animalConditions")
    .dropTableIfExists("conditions")
    .dropTableIfExists("animals")
    .dropTableIfExists("breed")
    .dropTableIfExists("species")
    .dropTableIfExists("userPreferences")
    .dropTableIfExists("users")
    .dropTableIfExists("roles");
}
