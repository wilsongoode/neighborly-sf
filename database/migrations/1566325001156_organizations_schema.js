"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class OrganizationsSchema extends Schema {
  up() {
    this.create("organizations", table => {
      table.increments();
      table.string("name");
      table.string("homepage_url");
      table.string("donate_url");
      table.text("about");
      table.string("address");
      table.json("categories");
      table.json("balance");
      table.timestamps();
    });
  }

  down() {
    this.drop("organizations");
  }
}

module.exports = OrganizationsSchema;
