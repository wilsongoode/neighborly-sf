"use strict";
const Logger = use("Logger");
const Database = use("Database");

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
    Logger.info("query found %d matching orgs", donor_options.length)
    return view.render("list",{ orgs: donor_options });
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
  async donate({ request, response, view }){

  }
}

module.exports = OrganizationController;
