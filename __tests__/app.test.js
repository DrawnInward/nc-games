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
  test("GET 200 returns only correct keys", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then((response) => {
        expect(response.body.reviews.length).toBe(13);
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
  test("GET 200 -- result object should be sorted in descending order by date", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then((response) => {
        expect(response.body.reviews).toBeSorted("created_at", {
          descending: true,
          coerce: true,
        });
      });
  });
  test("GET status 200 can select social deduction category", () => {
    return request(app)
      .get("/api/reviews?category=social%20deduction")
      .expect(200)
      .then((response) => {
        expect(response.body.reviews.length).toBe(11);
        response.body.reviews.forEach((review) => {
          expect(review.category).toBe("social deduction");
        });
      });
  });
  test("GET status 200 can select dexterity category", () => {
    return request(app)
      .get("/api/reviews?category=dexterity")
      .expect(200)
      .then((response) => {
        expect(response.body.reviews.length).toBe(1);
        response.body.reviews.forEach((review) => {
          expect(review.category).toBe("dexterity");
        });
      });
  });
  test("GET status 200 can sort by votes column", () => {
    return request(app)
      .get("/api/reviews?sort_by=votes")
      .expect(200)
      .then((res) => {
        expect(res.body.reviews).toBeSortedBy("votes", {
          coerce: true,
          descending: true,
        });
      });
  });
  test("GET status 200 can sort by designer column", () => {
    return request(app)
      .get("/api/reviews?sort_by=designer")
      .expect(200)
      .then((res) => {
        expect(res.body.reviews).toBeSortedBy("designer", { descending: true });
      });
  });
  test("GET status 200 order query works with ascending", () => {
    return request(app)
      .get("/api/reviews?order=asc")
      .expect(200)
      .then((res) => {
        expect(res.body.reviews).toBeSortedBy("created_at", {
          ascending: true,
        });
      });
  });
  test("GET status 404 if catergory doesn't exist in the database", () => {
    return request(app)
      .get("/api/reviews?category=select cards from creditcards;")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("invalid field entered");
      });
  });
  test("GET status 400 if passed an order that is not asc or desc", () => {
    return request(app)
      .get("/api/reviews?order=select cards from creditcards;")
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("invalid order");
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

describe("POST /api/reviews/:review_id/comments", () => {
  test("POST - status: 201 - adds a new comment and responds with the newly created comment object with the correct properties", () => {
    return request(app)
      .post("/api/reviews/3/comments")
      .expect(201)
      .send({
        username: "mallionaire",
        body: "Ah what a wonderful game! So simple I could play it with both of my hands full, as they were all night, with wine.",
      })
      .then((response) => {
        const { comment } = response.body;
        expect(comment).toHaveProperty("body");
        expect(comment).toHaveProperty("author");
        expect(comment).toHaveProperty("review_id");
        expect(comment).toHaveProperty("votes");
        expect(comment).toHaveProperty("created_at");
      });
  });
  test("POST - status: 201 - sucessfully adds the correct values to the table", () => {
    return request(app)
      .post("/api/reviews/3/comments")
      .expect(201)
      .send({
        username: "mallionaire",
        body: "Ah what a wonderful game! So simple I could play it with both of my hands full, as they were all night, with wine.",
      })
      .then((response) => {
        const { comment } = response.body;
        expect(comment.body).toBe(
          "Ah what a wonderful game! So simple I could play it with both of my hands full, as they were all night, with wine."
        );
        expect(comment.author).toBe("mallionaire");
        expect(comment).toHaveProperty("review_id");
        expect(comment.votes).toBe(0);
        expect(comment).toHaveProperty("created_at");
      });
  });
  test("will give 400 when given an invalid ID", () => {
    return request(app)
      .post("/api/reviews/SELECT * FROM cards/comments")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("bad request!");
      });
  });
  test("will give 400 when request object is not formatted correctly", () => {
    return request(app)
      .post("/api/reviews/3/comments")
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
      .post("/api/reviews/3000/comments")
      .expect(404)
      .send({
        username: "mallionaire",
        body: "Ah what a wonderful game! So simple I could play it with both of my hands full, as they were all night, with wine.",
      })
      .then((response) => {
        expect(response.body.msg).toBe("review id not found");
      });
  });
});
describe("/api/reviews/:review_id/comments", () => {
  test("should return the review with the correct properties", () => {
    return request(app)
      .get("/api/reviews/2/comments")
      .expect(200)
      .then((response) => {
        response.body.comments.forEach((comment) => {
          expect(comment).toHaveProperty("comment_id");
          expect(comment).toHaveProperty("votes");
          expect(comment).toHaveProperty("created_at");
          expect(comment).toHaveProperty("author");
          expect(comment).toHaveProperty("body");
          expect(comment).toHaveProperty("review_id");
        });
      });
  });
  test("will return 404 when given a valid id that does not exist", () => {
    return request(app)
      .get("/api/reviews/2000/comments")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("review id not found");
      });
  });
  test("will return 200 when given an id that does exist but has no comments associated with it", () => {
    return request(app)
      .get("/api/reviews/4/comments")
      .expect(200)
      .then((response) => {
        expect(response.body.comments).toEqual([]);
      });
  });
  test("will give 400 when given an invalid ID ", () => {
    return request(app)
      .get("/api/reviews/SELECT * FROM cards/comments")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("bad request!");
      });
  });
  test("GET 200 -- results should be sorted in descending order by date", () => {
    return request(app)
      .get("/api/reviews/2/comments")
      .expect(200)
      .then((response) => {
        expect(response.body.comments).toBeSorted({ descending: true });
      });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  test("DELETE - status 204 - will return 204 and no content", () => {
    return request(app).delete("/api/comments/3").expect(204);
  });
  test("DELETE - status 400 - will give 400 when given an invalid ID", () => {
    return request(app)
      .delete("/api/comments/SELECT * FROM cards")
      .then((response) => {
        expect(response.body.msg).toBe("bad request!");
      });
  });
  test("DELETE - status 404 - will give 400 when given a valid ID that doesn't exist", () => {
    return request(app)
      .delete("/api/comments/3000")
      .then((response) => {
        expect(response.body.msg).toBe("invalid field entered");
      });
  });
});

describe("GET /api/users", () => {
  test("GET 200 status from endpoint", () => {
    return request(app).get("/api/users").expect(200);
  });
  test("GET 200 returns correct keys", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then((response) => {
        expect(response.body.users.length).toBe(4);
        expect(Object.keys(response.body.users[0]).length).toBe(3);
        response.body.users.forEach((user) => {
          expect(user).toHaveProperty("username");
          expect(user).toHaveProperty("name");
          expect(user).toHaveProperty("avatar_url");
        });
      });
  });
});
