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

Route.on("/welcome").render("welcome");

Route.get("/query", "OrganizationController.query");

Route.get("/donate", "OrganizationController.donate")

// landing page
Route.on("/").render("index");

Route.on("/welcome").render("welcome");

// Route for before the user logged in
Route.group(() => {
  Route.get('/register', 'RegisterController.create').as('register.create')
  Route.post('/register', 'RegisterController.store').as('register.store').validator('Register')

  Route.get('/login', 'LoginController.create').as('login.create')
  Route.post('/login', 'LoginController.store').as('login.store')
}).middleware(['guest'])

// Route for after the user logged in
// Route.group(() => {
//   Route.get('/todos', 'TodoController.index').as('todos.index')
//   Route.post('/todos', 'TodoController.store').as('todos.store').validator('StoreTodo')
//   Route.get('/todos/:id/edit', 'TodoController.edit').as('todos.edit')
//   Route.patch('/todos/:id', 'TodoController.update').as('todos.update').validator('UpdateTodo')
//   Route.delete('/todos/:id', 'TodoController.destroy').as('todos.delete')
//   Route.post('/logout', 'LoginController.destroy').as('logout')
// }).middleware(['auth'])

//logout
Route.get("/logout", async ({ auth, response }) => {
  await auth.logout();
  return response.redirect("/");
});
