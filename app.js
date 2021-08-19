"use strict";

const path = require("path");
const AutoLoad = require("fastify-autoload");
const dotenv = require("dotenv");

module.exports = async function (fastify, opts) {
	dotenv.config();

	// This loads all plugins defined in plugins
	// those should be support plugins that are reused
	// through your application
	fastify.register(AutoLoad, {
		dir: path.join(__dirname, "plugins"),
		options: Object.assign({}, opts)
	});

	// Load all API routes from services
	fastify.register(AutoLoad, {
		dir: path.join(__dirname, "api"),
		options: Object.assign({prefix: "/api"}, opts)
	});

	// This loads all general routes defined in routes
	// define your routes in one of these
	fastify.register(AutoLoad, {
		dir: path.join(__dirname, "routes"),
		options: Object.assign({}, opts)
	});
};