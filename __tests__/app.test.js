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
describe.only("GET /api", () => {
  test("should return a JSON", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then((response) => {
        expect(response.headers["content-type"]).toMatch(/application\/json/);
      });
  });
  test("JSON should show what queries are accepted", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then((response) => {
        expect(response.body["GET /api/reviews"].queries).toEqual([
          "category",
          "sort_by",
          "order",
        ]);
      });
  });
  test("JSON should show what an example response looks like", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then((response) => {
        expect(response.body["GET /api/reviews"].exampleResponse).toEqual({
          reviews: [
            {
              title: "One Night Ultimate Werewolf",
              designer: "Akihisa Okui",
              owner: "happyamy2016",
              review_img_url:
                "https://images.pexels.com/photos/5350049/pexels-photo-5350049.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
              category: "hidden-roles",
              created_at: "2018-05-30T15:59:13.341Z",
              votes: 0,
              comment_count: 6,
            },
          ],
        });
      });
  });
});

});

