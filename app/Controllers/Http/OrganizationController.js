"use strict";
const Logger = use("Logger");
const Database = use("Database");
const currency = require("currency.js");

class OrganizationController {
  async query({ request, response, view }) {
    let prefs = request.get();
    prefs = Object.keys(prefs); // converts to array of keys
    Logger.info("request query is %s", prefs);

    const orgs = await Database.select("*").from("organizations");
    const donor_options = this._filterOrgs(
      orgs,
      prefs
    );

    Logger.info("query found %d matching orgs", donor_options.length);

    donor_options.sort(
      (a, b) => currency(b.balance).subtract(currency(a.balance)).intValue
    );
    return view.render("list", { orgs: donor_options });
  }

  async donate({ request, response, view }) {
    let prefs = request.get();
    Logger.info(prefs);
    let donation = currency(prefs.donation_amount);
    let choice = prefs.choice;
    prefs = Object.keys(prefs); // converts to array of keys

    Logger.info("keys: ", prefs);

    const orgs = await Database.select("*").from("organizations");
    const donor_options = this._filterOrgs(
      orgs,
      prefs
    );

    //let choice === "randomly" or "equally"
    if (choice === "randomly") {
      this._distributeRandomly(donor_options, donation);
    } else {
      this._distributeEqually(donor_options, donation);
    }

    let outputString = [];
    outputString.push(`Distributed your donation of $${donation} ${choice}`);
    for (let org of donor_options) {
      outputString.push(`${org.name} now has $${org.balance}`);
      const affectedOrg = await Database.table("organizations")
        .where("id", org.id)
        .update("balance", currency(org.balance).format());
    }
    // await Database.close();
    // const updated_orgs = await Database.select("*").from("organizations");
    // const { updated_options } = this._filterOrgs(updated_orgs, prefs);

    donor_options.sort((a, b) => {
      currency(b.balance).subtract(currency(a.balance)).intValue;
    });
    return view.render("list", { orgs: donor_options, message: outputString});
  }

  _filterOrgs(orgs, donor_prefs) {
    // let picked = [];
    let updated_options = orgs.filter(org => {
      if (donor_prefs.length === 0) return true;
      for (let pref = 0; pref < donor_prefs.length; pref++) {
        if (org.categories.includes(donor_prefs[pref])) {
          // picked.push(donor_prefs[pref]);
          return true;
        }
      }
      return false;
    });
    return updated_options; //, picked };
  }
  _distributeRandomly(recipients, donation) {
    let remaining_donation = currency(donation);
    let dist_array = recipients.map(x => currency(0));

    if (recipients.length === 1) {
      // only one recipient: receive entire donation
      recipients[0].balance = currency(recipients[0].balance)
        .add(remaining_donation)
        .format();
      remaining_donation = currency(0);
      return;
    }

    while (remaining_donation.intValue > 0) {
      // divide donation into each org in $0.50 increments
      let who = this._getRandomInt(0, dist_array.length - 1);

      if (remaining_donation.intValue < 50) {
        // 50 cents
        dist_array[who] = dist_array[who].add(remaining_donation);
        remaining_donation = currency(0);
        break;
      }

      dist_array[who] = dist_array[who].add(0.5); // only works on donations divisible by 50cents
      remaining_donation = remaining_donation.subtract(0.5);
    }

    for (let i = 0; i < recipients.length; i++) {
      recipients[i].balance = currency(recipients[i].balance)
        .add(dist_array[i].value)
        .format();
    }
    return;
  }

  _distributeEqually(recipients, donation) {
    let remaining_donation = donation;
    let dist_array = [];

    if (recipients.length === 1) {
      recipients[0].balance = currency(recipients[0].balance)
        .add(remaining_donation)
        .format();
      remaining_donation = 0;
      return;
    }
    dist_array = remaining_donation.distribute(recipients.length);

    for (let i = 0; i < recipients.length; i++) {
      recipients[i].balance = currency(recipients[i].balance)
        .add(dist_array[i].value)
        .format();
    }
    return;
  }

  _getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
}

module.exports = OrganizationController;
