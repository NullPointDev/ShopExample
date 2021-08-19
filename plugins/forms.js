"use strict";

const fp = require("fastify-plugin");

/**
 * This plugin parses x-form-urlencoded data types
 *
 * @see https://github.com/fastify/fastify-formbody
 */
module.exports = fp(async function (fastify, opts) {
	fastify.register(require("fastify-formbody"));
});
