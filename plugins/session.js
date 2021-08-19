"use strict";

const fp = require("fastify-plugin");

/**
 * This plugin adds some utilities to handle sessions.
 *
 * @see https://github.com/SerayaEryn/fastify-session
 */
module.exports = fp(async function (fastify, opts) {
	fastify.register(require("fastify-cookie"));
	fastify.register(require("fastify-session"), {
		secret: process.env.SESSION_SECRET,
		saveUninitialized: false,
		cookie: {
			httpOnly: true,
			resave: true,
			secure: false,
		},
	});
});
