"use strict";

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use("Route");
const Database = use("Database");

Route.on("/").render("welcome");

Route.get("/query", "OrganizationController.query");
// Route.get("/query", async () => {

//   //return await Database.raw('select * from images order by rand() limit 1')
//   const result = await Database.select("*")
//     .from("organizations")

//   return result;
// });
