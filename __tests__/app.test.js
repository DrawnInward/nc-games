const request = require("supertest");
const app = require("../app/app");
const data = require("../db/data/test-data");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  db.end();
});

describe.only("GET /api/categories", () => {
  test("GET 200 status from endpoint", () => {
    return request(app).get("/api/categories").expect(200);
  });
  test("GET 200 returns correct keys", () => {
    return request(app)
      .get("/api/categories")
      .expect(200)
      .then((response) => {
        response.body.categories.forEach((category) => {
          expect(category).toHaveProperty("slug");
          expect(category).toHaveProperty("description");
        });
      });
  });
});
describe("GET /api", () => {
  test("should return a JSON", () => {
    return request(app).get("/api");
  });
});
