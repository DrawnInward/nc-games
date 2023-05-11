const request = require("supertest");
const app = require("../app/app");
const data = require("../db/data/test-data");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");

beforeEach(() => seed(data));

afterAll(() => db.end());

describe("GET /api/categories", () => {
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

describe("/api/reviews/:review_id", () => {
  test("should return the review with the correct properties", () => {
    return request(app)
      .get("/api/reviews/2")
      .expect(200)
      .then((response) => {
        expect(response.body.review).toHaveProperty("review_id");
        expect(response.body.review).toHaveProperty("title");
        expect(response.body.review).toHaveProperty("review_body");
        expect(response.body.review).toHaveProperty("designer");
        expect(response.body.review).toHaveProperty("review_img_url");
        expect(response.body.review).toHaveProperty("votes");
        expect(response.body.review).toHaveProperty("category");
        expect(response.body.review).toHaveProperty("owner");
        expect(response.body.review).toHaveProperty("created_at");
      });
  });
  test("will return 404 when given a valid id that does not exist", () => {
    return request(app)
      .get("/api/reviews/2000")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("review not found");
      });
  });
  test("will give 400 when given an invalid ID ", () => {
    return request(app)
      .get("/api/reviews/SELECT * FROM cards")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("bad request!");
      });
  });
});

describe("GET /api/reviews", () => {
  test("GET 200 status from endpoint", () => {
    return request(app).get("/api/reviews").expect(200);
  });
  test("GET 200 returns correct keys", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then((response) => {
        response.body.reviews.forEach((review) => {
          expect(review).toHaveProperty("owner");
          expect(review).toHaveProperty("review_id");
          expect(review).toHaveProperty("category");
          expect(review).toHaveProperty("review_img_url");
          expect(review).toHaveProperty("created_at");
          expect(review).toHaveProperty("votes");
          expect(review).toHaveProperty("designer");
          expect(review).toHaveProperty("comment_count");
        });
      });
  });
  test("GET 200 -- comment count should return the correct number of comment id's associated with each review id", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then((response) => {
        expect(response.body.reviews[5].comment_count).toBe("3");
        expect(response.body.reviews[5].review_id).toBe(2);
      });
  });
  test("GET 200 -- result object shouldn't have a review_body property", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then((response) => {
        response.body.reviews.forEach((review) => {
          expect(review).not.toHaveProperty("review_body");
        });
      });
  });
  test("GET 200 -- result object shouldn't have a review_body property", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then((response) => {
        expect(response.body.reviews).toBeSorted({ descending: true });
      });
  });
});
describe("PATCH /api/reviews/:review_id", () => {
  test("PATCH - status: 200 - updates votes correctly if votes increment is positive, on the correct object", () => {
    return request(app)
      .patch("/api/reviews/2")
      .expect(200)
      .send({
        inc_votes: 15,
      })
      .then((response) => {
        const { review } = response.body;
        expect(Object.keys(review).length).toBe(9);
        expect(review.owner).toBe("philippaclaire9");
        expect(review.votes).toBe(20);
      });
  });
  test("PATCH - status: 200 - updates votes correctly if votes increment is negative, on the correct object", () => {
    return request(app)
      .patch("/api/reviews/3")
      .expect(200)
      .send({
        inc_votes: -100,
      })
      .then((response) => {
        const { review } = response.body;
        expect(Object.keys(review).length).toBe(9);
        expect(review.owner).toBe("bainesface");
        expect(review.votes).toBe(-95);
      });
  });
  test("will give 400 when given an invalid ID", () => {
    return request(app)
      .patch("/api/reviews/SELECT * FROM cards")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("bad request!");
      });
  });
  test("will give 400 when request object is not formatted correctly", () => {
    return request(app)
      .patch("/api/reviews/3")
      .expect(400)
      .send({
        username: "mallionaire",
        body: "Ah what a wonderful game! So simple I could play it with both of my hands full, as they were all night, with wine.",
        votes: 10000000000,
      })
      .then((response) => {
        expect(response.body.msg).toBe("bad request!");
      });
  });
  test("will return 404 when given a valid id that does not exist", () => {
    return request(app)
      .patch("/api/reviews/3000")
      .expect(404)
      .send({
        inc_votes: -100,
      })
      .then((response) => {
        const { comment } = response.body;
        expect(response.body.msg).toBe("review id not found");
      });
  });
});
