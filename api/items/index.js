"use strict";

module.exports = async function (fastify, opts) {
	fastify.get("/", (request, reply) => {
		// Returns an array of all items in the DB
		return fastify.db.prepare("SELECT * FROM ITEM").all();
	});
};