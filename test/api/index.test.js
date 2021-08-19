"use strict";

const { test } = require("tap");
const { build } = require("../helper");

test("API root", async (t) => {
	const app = build(t);

	const res = await app.inject({
		url: "/api"
	});
	t.same(JSON.parse(res.payload), { root: true });
});

test("Invalid route returns 404", async (t) => {
	const app = build(t);

	const res = await app.inject({
		url: "/api/404"
	});
	t.same(JSON.parse(res.payload), {success:false, errorCode: 404, message: "Invalid API Route"});
});

// inject callback style:
//
// test('default root route', (t) => {
//   t.plan(2)
//   const app = build(t)
//
//   app.inject({
//     url: '/'
//   }, (err, res) => {
//     t.error(err)
//     t.same(JSON.parse(res.payload), { root: true })
//   })
// })
