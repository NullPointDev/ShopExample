"use strict";

module.exports = async function (fastify, opts) {
	const getUser = (session) => session.user ? fastify.getUser(session.user.id) : {};

	fastify.get("/", (request, reply) => {
		const user = getUser(request.session);
		// Checks if a valid user was returned
		let success = user.id ? true : false;
		if(!success) return {success, items: []};
		// Gets a list of items that are in the user's cart
		let items = fastify.db.prepare("SELECT item.id, item.name, item.price, cart.qty FROM cart JOIN item ON item.id = cart.item WHERE user = ?").all(user.id);
		// Returns an object with cart item data
		return {success, items};
	});

	fastify.post("/", {
		schema: {
			body: {
				type: "object", required: ["item", "qty"], properties: {
					item: {type: "number"},
					qty: {type: "number", minimum: 1}
				}
			}
		}
	}, (request, reply) => {
		const user = getUser(request.session);
		// Checks if a valid user was returned
		let success = user.id ? true : false;
		if(!success) return {success};
		else {
			try {
				fastify.db.prepare("REPLACE INTO cart (user, item, qty) VALUES(?,?,?)").run(user.id,request.body.item,request.body.qty);
				return {success};
			} catch {
				return {success:false};
			}
		}
	});

	fastify.delete("/", {
		schema: {
			body: {
				type: "object", required: ["item"], properties: {
					item: {type: "number"}
				}
			}
		}
	}, (request, reply) => {
		const user = getUser(request.session);
		// Checks if a valid user was returned
		let success = user.id ? true : false;
		if(!success) return {success};
		else {
			try {
				fastify.db.prepare("DELETE FROM cart WHERE user = ? AND item = ?").run(user.id,request.body.item);
				return {success};
			} catch {
				return {success:false};
			}
		}
	});
};