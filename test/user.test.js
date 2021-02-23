const app = require("../src/app");
const request = require("supertest");
const User = require("../src/models/User");
const { userOneId, userOne, setupDatabase } = require("./fixtures/db");

beforeEach(setupDatabase);

test("Create a User", async () => {
  const response = await request(app)
    .post("/user")
    .send({
      email: "testmail@kuwar.tk",
      name: "Hello tester",
      password: "obviouslyTest",
    })
    .expect(201);

  //assert that database was changed correctly
  const user = await User.findById(response.body.user._id);
  expect(user).not.toBeNull();

  expect(response.body).toMatchObject({
    user: {
      name: "Hello tester",
      email: "testmail@kuwar.tk",
    },
    token: user.tokens[0].token,
  });
  expect(user.password).not.toBe("obviouslyTest");
});

test("Login Existing User", async () => {
  const res = await request(app)
    .post("/user/login")
    .send({
      email: userOne.email,
      password: userOne.password,
    })
    .expect(200);

  const user = await User.findById(userOneId);
  expect(res.body.token).toBe(user.tokens[1].token);
});

test("Should not login non existing users", async () => {
  await request(app)
    .post("/user/login")
    .send({
      email: "Ali@kuwar.tk",
      password: "!@#$Gun",
    })
    .expect(400);
});

test("Should get user details of authanticated user", async () => {
  await request(app)
    .get("/user/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
});

test("Should not get user details of unauthenticated user", async () => {
  await request(app).get("/user/me").send().expect(401);
});

test("should delete user account", async () => {
  const res = await request(app)
    .delete("/user/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);

  const user = await User.findById(userOneId);
  expect(user).toBeNull();
});

test("should not delete unauthenticated user account", async () => {
  await request(app)
    .delete("/user/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}a`)
    .send()
    .expect(401);
});

test("should upload avatar", async () => {
  await request(app)
    .post("/user/me/avatar")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .attach("avatar", "test/fixtures/profile.png")
    .expect(200);

  const user = await User.findById(userOneId);
  expect(user.avatar).toEqual(expect.any(Buffer));
});

test("should update valid user field", async () => {
  await request(app)
    .patch("/user/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({
      name: "Testing",
    })
    .expect(200);

  const user = await User.findById(userOneId);
  expect(user.name).toBe("Testing");
});

test("Should not update invalid user field", async () => {
  await request(app)
    .patch("/user/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({
      pasword: "ali123456",
    })
    .expect(400);
});
