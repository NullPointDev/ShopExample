"use strict";

const fp = require("fastify-plugin");
const path = require("path");

/**
 * This plugin handles rendering templates
 *
 * @see https://github.com/fastify/point-of-view
 */
module.exports = fp(async function (fastify, opts) {
	fastify.register(require("point-of-view"), {
		engine: {
			pug: require("pug")
		},
		root: path.join(__dirname, "../views")
	});
});
