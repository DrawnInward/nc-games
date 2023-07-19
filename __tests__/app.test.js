const request = require("supertest");
const app = require("../app/app");
const data = require("../db/data/test-data");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const bcrypt = require("bcrypt");

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
        expect(Object.keys(response.body.review).length).toBe(10);
        expect(response.body.review).toHaveProperty("review_id");
        expect(response.body.review).toHaveProperty("title");
        expect(response.body.review).toHaveProperty("review_body");
        expect(response.body.review).toHaveProperty("designer");
        expect(response.body.review).toHaveProperty("review_img_url");
        expect(response.body.review).toHaveProperty("votes");
        expect(response.body.review).toHaveProperty("category");
        expect(response.body.review).toHaveProperty("owner");
        expect(response.body.review).toHaveProperty("created_at");
        expect(response.body.review).toHaveProperty("comment_count");
      });
  });
  test("will return 404 when given a valid id that does not exist", () => {
    return request(app)
      .get("/api/reviews/2000")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("invalid field entered");
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
  test("should return the count of all comments associated with this review id under the comment_count key", () => {
    return request(app)
      .get("/api/reviews/2")
      .expect(200)
      .then((response) => {
        expect(response.body.review.comment_count).toBe("3");
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
        expect(response.body.msg).toBe("invalid field entered");
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
        expect(response.body.msg).toBe("invalid field entered");
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
        expect(response.body.msg).toBe("invalid field entered");
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
  test("DELETE - status 404 - will give 404 when given a valid ID that doesn't exist", () => {
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
        expect(Object.keys(response.body.users[0]).length).toBe(4);
        response.body.users.forEach((user) => {
          expect(user).toHaveProperty("username");
          expect(user).toHaveProperty("name");
          expect(user).toHaveProperty("avatar_url");
        });
      });
  });

  describe("/api/users/:username", () => {
    test("should return the user with the correct properties", () => {
      return request(app)
        .get("/api/users/philippaclaire9")
        .expect(200)
        .then((response) => {
          expect(Object.keys(response.body.user).length).toBe(4);
          expect(response.body.user).toHaveProperty("username");
          expect(response.body.user).toHaveProperty("avatar_url");
          expect(response.body.user).toHaveProperty("name");
        });
    });
    test("will return 404 when given a valid id that does not exist", () => {
      return request(app)
        .get("/api/users/harold")
        .expect(404)
        .then((response) => {
          expect(response.body.msg).toBe("invalid field entered");
        });
    });
  });
});

describe("POST /api/users", () => {
  test("status 201 -- should post new user", () => {
    return request(app)
      .post("/api/users")
      .expect(201)
      .send({
        username: "Bacchus",
        password: "Password",
        name: "Theodor",
        avatar_url:
          "https://images.unsplash.com/photo-1575936123452-b67c3203c357?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aW1hZ2V8ZW58MHx8MHx8fDA%3D&w=1000&q=80",
      })
      .then((response) => {
        expect(response.body.newUser).toHaveProperty("username");
        expect(response.body.newUser).toHaveProperty("avatar_url");
        expect(response.body.newUser).toHaveProperty("name");
        expect(response.body.newUser).toHaveProperty("password");
        expect(response.body.newUser.password).not.toBe("Password");
      })
      .then(() => {
        return request(app)
          .get("/api/users/Bacchus")
          .expect(200)
          .then((response) => {
            expect(Object.keys(response.body.user).length).toBe(4);
            expect(response.body.user).toHaveProperty("username");
            expect(response.body.user).toHaveProperty("avatar_url");
            expect(response.body.user).toHaveProperty("name");
            expect(response.body.user).toHaveProperty("password");
          });
      });
  });
  test("status 400 -- should handle error when fields are missing", () => {
    return request(app)
      .post("/api/users")
      .expect(400)
      .send({
        username: "Bacchus",
        name: "Theodor",
        avatar_url:
          "https://images.unsplash.com/photo-1575936123452-b67c3203c357?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aW1hZ2V8ZW58MHx8MHx8fDA%3D&w=1000&q=80",
      })
      .then((response) => {
        expect(response.body.msg).toBe("bad request!");
      });
  });
  test("status 400 -- should handle error when additional fiedls are sent", () => {
    return request(app)
      .post("/api/users")
      .expect(400)
      .send({
        username: "Bacchus",
        password: "Password",
        name: "Theodor",
        avatar_url:
          "https://images.unsplash.com/photo-1575936123452-b67c3203c357?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aW1hZ2V8ZW58MHx8MHx8fDA%3D&w=1000&q=80",
        additionalField: "injection",
      })
      .then((response) => {
        expect(response.body.msg).toBe("bad request!");
      });
  });
  test("status 400 -- should handle error if values are not strings", () => {
    return request(app)
      .post("/api/users")
      .expect(400)
      .send({
        username: "Bacchus",
        password: true,
        name: "Theodor",
        avatar_url:
          "https://images.unsplash.com/photo-1575936123452-b67c3203c357?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aW1hZ2V8ZW58MHx8MHx8fDA%3D&w=1000&q=80",
      })
      .then((response) => {
        expect(response.body.msg).toBe("bad request!");
      });
  });
});

describe("PATCH /api/users/:username", () => {
  test("status 200 -- should modify one given field", () => {
    return request(app)
      .patch("/api/users/philippaclaire9")
      .expect(200)
      .send({ name: "Cullera" })
      .then((response) => {
        const { updatedUser } = response.body;
        expect(Object.keys(updatedUser).length).toBe(4);
        expect(updatedUser.username).toBe("philippaclaire9");
        expect(updatedUser.name).toBe("Cullera");
      });
  });
  test("status 200 -- should modify more than one field is supplied", () => {
    return request(app)
      .patch("/api/users/philippaclaire9")
      .expect(200)
      .send({
        name: "Cullera",
        avatar_url:
          "https://images.unsplash.com/photo-1575936123452-b67c3203c357?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aW1hZ2V8ZW58MHx8MHx8fDA%3D&w=1000&q=80",
      })
      .then((response) => {
        const { updatedUser } = response.body;
        expect(Object.keys(updatedUser).length).toBe(4);
        expect(updatedUser.username).toBe("philippaclaire9");
        expect(updatedUser.name).toBe("Cullera");
        expect(updatedUser.avatar_url).toBe(
          "https://images.unsplash.com/photo-1575936123452-b67c3203c357?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aW1hZ2V8ZW58MHx8MHx8fDA%3D&w=1000&q=80"
        );
      });
  });
  test("status 400 -- should throw correct error if fileds are sent that are not in greenlist", () => {
    return request(app)
      .patch("/api/users/philippaclaire9")
      .expect(400)
      .send({
        messageToJon:
          "Remember that excellence, like all things, is a habit. And rememebr that you are not excellent (yet)",
      })
      .then((response) => {
        expect(response.body.msg).toBe("Bad request! Invalid fields.");
      });
  });
  test("status 400 -- should throw correct error any value is not a string", () => {
    return request(app)
      .patch("/api/users/philippaclaire9")
      .expect(400)
      .send({
        name: true,
        avatar_url:
          "https://images.unsplash.com/photo-1575936123452-b67c3203c357?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aW1hZ2V8ZW58MHx8MHx8fDA%3D&w=1000&q=80",
      })
      .then((response) => {
        expect(response.body.msg).toBe("Bad request! Invalid fields.");
      });
  });
});

describe("DELETE /api/users/:username", () => {
  test("status 204 -- successfully deletes a given user, along with reviews and comments they have authored", () => {
    return request(app)
      .delete("/api/users/philippaclaire9")
      .expect(204)
      .then(() => {
        return request(app)
          .get("/api/users")
          .expect(200)
          .then((response) => {
            expect(response.body.users.length).toBe(3);
            response.body.users.forEach((user) => {
              expect(user.username).not.toBe("philippaclaire9");
            });
          });
      })
      .then(() => {
        return request(app)
          .get("/api/reviews")
          .expect(200)
          .then((response) => {
            expect(response.body.reviews.length).toBe(12);
            response.body.reviews.forEach((user) => {
              expect(user.author).not.toBe("philippaclaire9");
            });
          });
      })
      .then(() => {
        return request(app)
          .get("/api/reviews/3/comments")
          .expect(200)
          .then((response) => {
            expect(response.body.comments.length).toBe(1);
            response.body.comments.forEach((user) => {
              expect(user.author).not.toBe("philippaclaire9");
            });
          });
      });
  });
  test("status 404 -- correctly handles error if username does not exist", () => {
    return request(app)
      .delete("/api/users/philippaclaire")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("invalid field entered");
      });
  });
});

describe("PATCH /api/comments/:comment_id", () => {
  test("PATCH - status: 200 - updates votes correctly if votes increment is positive, on the correct object", () => {
    return request(app)
      .patch("/api/comments/2")
      .expect(200)
      .send({
        inc_votes: 15,
      })
      .then((response) => {
        const { comment } = response.body;
        expect(Object.keys(comment).length).toBe(6);
        expect(comment.author).toBe("mallionaire");
        expect(comment.votes).toBe(28);
      });
  });
  test("PATCH - status: 200 - updates votes correctly if votes increment is negative, on the correct object", () => {
    return request(app)
      .patch("/api/comments/3")
      .expect(200)
      .send({
        inc_votes: -100,
      })
      .then((response) => {
        const { comment } = response.body;
        expect(Object.keys(comment).length).toBe(6);
        expect(comment.author).toBe("philippaclaire9");
        expect(comment.votes).toBe(-90);
      });
  });

  test("will give 400 when given an invalid ID", () => {
    return request(app)
      .patch("/api/comments/SELECT * FROM cards")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("bad request!");
      });
  });

  test("will give 400 when request object is not formatted correctly", () => {
    return request(app)
      .patch("/api/comments/3")
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
      .patch("/api/comments/3000")
      .expect(404)
      .send({
        inc_votes: -100,
      })
      .then((response) => {
        const { comment } = response.body;
        expect(response.body.msg).toBe("invalid field entered");
      });
  });
});

describe("Authentication", () => {
  test("will return user if password and hashed password match", () => {
    return request(app)
      .post("/api/users/authentication")
      .expect(200)
      .send({
        username: "mallionaire",
        password: "Password",
      })
      .then((response) => {
        const { user } = response.body;
        expect(user.username).toBe("mallionaire");
      });
  });
  test("will return error if password and hanshed password do not match", () => {
    return request(app)
      .post("/api/users/authentication")
      .expect(400)
      .send({
        username: "mallionaire",
        password: "Password1!",
      })
      .then((response) => {
        const { user } = response.body;
        expect(response.body.msg).toBe("Password incorrect");
      });
  });
  test("will return error if usrename does not exist", () => {
    return request(app)
      .post("/api/users/authentication")
      .expect(404)
      .send({
        username: "coolBoy420",
        password: "Password1!",
      })
      .then((response) => {
        const { user } = response.body;
        expect(response.body.msg).toBe("invalid field entered");
      });
  });
});
