"use strict";

module.exports = async function (fastify, opts) {
	const getUser = (session) => session.user ? fastify.getUser(session.user.id) : {};

	fastify.get("/", (request) => {
		const user = getUser(request.session);
		// Checks if a valid user was returned
		let success = user.id ? true : false;
		// Returns an object with user data
		return {success, user};
	});
};