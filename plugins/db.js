"use strict";

const fp = require("fastify-plugin");

const Database = require("better-sqlite3");
const db = new Database("data/sqlite.db");

/**
 * This plugin wraps better-sqlite3 for easy database access in routes.
 */
module.exports = fp(async function (fastify, opts) {
	fastify.decorate("db", db);

	// Quite a simple and cheaty way of doing this, but I can't think of a better way.
	// ¯\_(ツ)_/¯
	fastify.decorate("getUser", (id) => {
		let user = fastify.db.prepare("SELECT id, fName, lName, email FROM user WHERE id = ?").get(id);
		if(!user) return {};
		else user.cart = fastify.db.prepare("SELECT * FROM cart WHERE user = ?").all(id);
		return user;
	});
});
