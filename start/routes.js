'use strict'

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

// landing page
Route.on("/").render("index");

Route.on("/welcome").render("welcome");

// login page
Route.on("/login").render("auth.login");
Route.post("/login", "UserController.login").validator("LoginUser");

//sign up
Route.on("/signup").render("auth.signup");
Route.post("/signup", "UserController.create").validator("CreateUser");

//logout
Route.get("/logout", async ({ auth, response }) => {
  await auth.logout();
  return response.redirect("/");
});