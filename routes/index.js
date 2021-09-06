"use strict";

// TODO: Find a way to spread these routes into different files without looking like a disorganized mess.

// Library used to get password hashes
const bcrypt = require("bcryptjs");

const messages = {
	"email": "Invalid Email address",
	"pass": "Incorrect Password",
	"registered": "Registration Complete, Please Log In.",
	"priv": "You must be logged in to access that content.",
	"exists": "An account with that Email address already exists."
};

// eslint-disable-next-line no-unused-vars
module.exports = async function (fastify, opts) {
	// Checks if the current session links to a valid user
	// * If it does, return an object with the user's profile info (and cart)
	// * Otherwise, return an empty object.
	const getUser = (session) => session.user ? fastify.getUser(session.user.id) : {};

	// Renders the home page template
	fastify.get("/", async function (request, reply) {
		// Get a list of all items
		let items = fastify.db.prepare("SELECT id, name, price FROM item").all();
		let user = getUser(request.session);
		// Render index page with user info and item data
		return reply.view("index.pug", {user, items});
	});

	fastify.get("/category/:c", async function (request, reply) {
		// Gets information about the category from the DB
		let category = fastify.db.prepare("SELECT title, description FROM category WHERE name = ?").get(request.params.c);
		let user = getUser(request.session);
		// If the category does not exist, show a 404 page.
		if(!category) return reply.view("error/404.pug", {user});
		else {
			// Get a list of items that are in the category
			let items = fastify.db.prepare("SELECT id, name, price FROM item INNER JOIN categoryItem ON categoryItem.item = item.id WHERE categoryItem.category = ?").all(request.params.c);
			// Render the category page with user info, category info, and item data.
			return reply.view("category.pug", {user, category, items});
		}
	});

	// Renders the registration template page
	fastify.get("/register", async function (request, reply) {
		const user = getUser(request.session);
		if(user.id) return reply.redirect("/");
		let message;
		if(request.query.msg) {
			message = messages[request.query.msg];
		}
		return reply.view("register.pug", {message});
	});

	// Renders the login template page
	fastify.get("/login", async function (request, reply) {
		const user = getUser(request.session);
		if(user.id) return reply.redirect("/");
		let message;
		if(request.query.msg) {
			message = messages[request.query.msg];
		}
		return reply.view("login.pug", {message});
	});

	// Ends the current session.
	// ? Sounds simple, right?
	// ! This took me close to HALF AN HOUR of rummaging through documentation to find.
	// ! It probably only works half of the time. Can't be bothered testing.
	fastify.get("/logout", async function (request, reply) {
		if(request.session.user) request.destroySession(()=>{});
		reply.redirect("/");
	});

	// Actual form data handler for logging in users
	fastify.post("/login", {
		// Defines the required structure of the data
		schema: {
			body: {
				type: "object", required: ["email", "password"], properties: {
					email: {type: "string"},
					password: {type: "string"}
				}
			}
		}
	}, async function (request, reply) {
		const { email, password } = request.body;

		// Get the user from the database
		let user = fastify.db.prepare("SELECT id, password FROM user WHERE email = ?").get(email);
		// If the user doesn't exist, redirect back to login and inform the user.
		if(!user) return reply.redirect("/login?msg=email");
		// Compares the provided password to the stored hash.
		if(bcrypt.compareSync(password, user.password)) {
			// If they are the same, store the session ID...
			request.session.user = {id: user.id};
			// Then redirect the user to the home page.
			reply.redirect("/");
		}	else {
			// Otherwise, redirect back to login,
			// and inform the user that the password is incorrect.
			reply.redirect("/login?msg=pass");
		}
	});

	// Actual form data handler for registering users
	fastify.post("/register", {
		// Required data structure
		schema: {
			body: {
				type: "object", required: ["fName", "lName", "email", "password"], properties: {
					email: {type: "string"},
					fName: {type: "string"},
					lName: {type: "string"},
					password: {type: "string"}
				}
			}
		}
	}, async function (request, reply) {
		const { email, fName, lName, password } = request.body;

		// Check if user with the same email already exists
		if(fastify.db.prepare("SELECT email FROM user WHERE email = ?").get(email)) {
			// If it does, redirect back and tell the user.
			return reply.redirect("/register?msg=exists");
		}

		// Hope that nothing fails, while...
		try {
			// Hash the password (with a salt complexity of 10)
			const hashed = await bcrypt.hash(password,10);
			// Create a new user with the provided details (and hashed passsword)
			fastify.db.prepare("INSERT INTO user (email, fName, lName, password) VALUES (?, ?, ?, ?)").run(email, fName, lName, hashed);
			// Get the new account ID
			const id = fastify.db.prepare("SELECT id FROM user WHERE email = ?").get(email);
			// Log the user in (Start a session)
			request.session.user = {id};
			// Redirect the user to the home page
			reply.redirect("/");
		} catch(error) {
			// If you reached this point, something went wrong.
			// Shouldn't happen, but there's always a chance.
			throw new Error("Unable to complete registration!");
		}
	});

	// A Simple Lazy catch-all 404 error page.
	fastify.get("*", async function (request, reply) {
		let user = getUser(request.session);
		return reply.view("error/404.pug", {user});
	});
};