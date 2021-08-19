"use strict";

const { test } = require("tap");
const { build } = require("../../helper");

const db = new require("better-sqlite3")("data/sqlite.db");

test("API Item list route", async (t) => {
	const app = build(t);

	const res = await app.inject({
		url: "/api/items"
	});

	const items = db.prepare("SELECT * FROM item").all();

	t.same(JSON.parse(res.payload), items);
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
