"use strict";

module.exports = async function (fastify, opts) {
	fastify.get("/", async function (request, reply) {
		return { root: true };
	});

	fastify.get("*", async function (request, reply) {
		return reply.code(404).send({success:false, errorCode: 404, message: "Invalid API Route"});
	});
};