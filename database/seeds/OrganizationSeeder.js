"use strict";

/*
|--------------------------------------------------------------------------
| OrganizationSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use("Factory");
const Database = use("Database");
const fs = require("fs");

class OrganizationSeeder {
  async run() {
    const fileContents = await fs.readFileSync(
      "database/seeds/homeless_orgs.json",
      "utf8"
    );
    const groups = [
      "Food",
      "Housing",
      "Health_Care",
      "Supplies",
      "Advisory_Counseling",
      "Employment_Training",
      "Community",
      "Families_Women_and_Children"
    ];
    try {
      const data = JSON.parse(fileContents);
      for (let i = 0; i < data.length; i++) {
        let filtered_categories = [];
        Object.entries(data[i]).forEach(([key, value]) => {
          if (groups.includes(key) && value === "x") {
            filtered_categories.push(key);
          }
        });
        // fixes missing http
        let site =
          data[i].Website.startsWith("http://") ||
          data[i].Website.startsWith("https://")
            ? data[i].Website
            : "https://" + data[i].Website;
        console.log(site);
        // console.log(`${data[i].Name} has the following categories:`);
        // console.log(filtered_categories);
        const record = await Database.table("organizations").insert({
          name: data[i].Name,
          about: data[i].About,
          homepage_url: site,
          email: data[i].Email,
          phone: data[i].Phone,
          address: data[i].Address,
          categories: JSON.stringify(filtered_categories),
          balance: 0
          // created_at: Database.fn.now(),
          // updated_at: Database.fn.now()
        });
      }
    } catch (err) {
      console.error(err);
    }
  }
}

module.exports = OrganizationSeeder;
