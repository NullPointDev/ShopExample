# Shop Example

An example shop/store site for my Digital Solutions class assignment.

## Development

Clone the Repository

```sh
git clone https://github.com/NullPointDev/ShopExample
```

Install Dependencies

```sh
npm install
```

Run in Development

> You will need to have a `.env` file with a `SESSION_SECRET` first.

```sh
npm run dev
```

## Test

Run Tests

> Tests don't yet have 100% coverage, [see below](#to-do).

```sh
npm run test
```

## To-Do

- [x] Create authentication pages
  - [x] Login
  - [x] Register
- [ ] Create user pages
  - [ ] Purchase History
  - [ ] Cart
  - [ ] Purchase
- [ ] Create Product Pages
  - [ ] Search
  - [ ] Categories
  - [ ] Product
- [ ] Write Tests for auth API routes
- [ ] Write Tests for front-end routes
- [x] Find solution to Fastify `watch` refreshing on DB update
