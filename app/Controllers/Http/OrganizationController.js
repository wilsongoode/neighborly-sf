"use strict";
const Logger = use("Logger");
const Database = use("Database");
const currency = require("currency.js");
const Organization = use('App/Models/Organization')


class OrganizationController {
  async query({ request, response, view }) {
    let prefs = request.get();
    // request query is { Food: 'on', Housing: 'on', Advisory_Counseling: 'on' }
    prefs = Object.keys(prefs); // converts to array of keys
    Logger.info("request query is %s", prefs);
    const orgs = await Database.select("*").from("organizations");
    const donor_options = this._filterOrgs(orgs, prefs);
    // Logger.info(donor_options[0]);
    // console.log(donor_options[0]);
    Logger.info("query found %d matching orgs", donor_options.length);
    return view.render("list", { orgs: donor_options });
  }

  async donate({ request, response, view }) {
    let prefs = request.get();
    
    Logger.info(prefs);
    console.log(prefs);
    let donation = currency(prefs.donation_amount);
    let choice = prefs.choice;
    prefs = Object.keys(prefs); // converts to array of keys
    console.log(donation);
    let donor_prefs = ["food"];
    console.log(donor_prefs);

    const orgs = await Database.select("*").from("organizations");
    // const orgs = await Organization.table()
    // effectively: select * from orgs where categories includes donor_prefs
    const donor_options = this._filterOrgs(orgs, prefs);
    
    console.log("here are the organizations that match your preferences:");
    // console.log(donor_options);
    console.log("distributing your donation");
    
    //let choice = "equally"; // "randomly" or "equally"
    if (choice === "randomly") {
      this._distributeRandomly(donor_options, donation);
    } else {
      this._distributeEqually(donor_options, donation);
    }
    let outputString = "";
    outputString += `distributed your donation of $${donation} ${choice}\n`;
    console.log(`distributed your donation of $${donation} ${choice}`);
    for (let org of donor_options) {
      // console.log(`${org.balance}`);
      outputString += `${org.name} now has $${org.balance}\n`
      console.log(`"${org.name}" now has $${org.balance}`);
      // currency is automatically formatted when used in string interpolation
    }
    return view.render("list", { orgs: donor_options, outputString});
  }


  _filterOrgs(orgs, donor_prefs) {
    let donor_options = orgs.filter(org => {
      if (donor_prefs.length === 0) return true;
      for (let pref = 0; pref < donor_prefs.length; pref++) {
        // console.log(`searching for ${donor_prefs[pref]} in ${org.name}`);
        if (org.categories.includes(donor_prefs[pref])) {
          //   console.log(true);
          return true;
        }
        // console.log(`${donor_prefs[pref]} not in ${org.name}`);
      }
      //   console.log(false);
      return false;
    });
    return donor_options;
  }
  _distributeRandomly(recipients, donation) {
    let remaining_donation = currency(donation);
    let dist_array = recipients.map(x => currency(0));
    // console.log(`empty dist_array: ${dist_array}`);
    if (recipients.length === 1) {
      // only one recipient: receive entire donation
      recipients[0].balance = currency(recipients[0].balance).add(remaining_donation).value;
      remaining_donation = currency(0);
      return;
    }
    while (remaining_donation.intValue > 0) {
      // divide donation into each org in $0.50 increments
      let who = this._getRandomInt(0, dist_array.length - 1);
      // console.log(`org: ${who}`);
      // console.log(`remain: ${remaining_donation.value}`);

      if (remaining_donation.intValue < 50) {
        // 50 cents
        dist_array[who] = dist_array[who].add(remaining_donation);
        remaining_donation = currency(0);
        break;
      }
      // only works on donations divisible by 50cents
      dist_array[who] = dist_array[who].add(0.5);
      remaining_donation = remaining_donation.subtract(0.5);
    }
    console.log(dist_array.map(x => x.value));
    // add balance to recipients
    for (let i = 0; i < recipients.length; i++) {
      recipients[i].balance = currency(recipients[i].balance).add(dist_array[i].value).value;
    }
    return;
  }

  _distributeEqually(recipients, donation) {
    let remaining_donation = donation;
    let dist_array = [];

    if (recipients.length === 1) {
      recipients[0].balance = currency(recipients[0].balance).add(remaining_donation).value;
      remaining_donation = 0;
      return;
    }
    dist_array = remaining_donation.distribute(recipients.length);
    // console.log("array: ", dist_array);

    for (let i = 0; i < recipients.length; i++) {
      recipients[i].balance = currency(recipients[i].balance).add(dist_array[i].value).value;
    }
    return;
  }

  _getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
}

module.exports = OrganizationController;
