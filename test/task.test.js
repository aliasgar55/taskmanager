const request = require("supertest");
const Task = require("../src/models/Task");
const {
  userOneId,
  userOne,
  taskOne,
  userTwo,
  setupDatabase,
} = require("./fixtures/db");
const app = require("../src/app");
const { response } = require("express");

beforeEach(setupDatabase);
test("create a task", async () => {
  const response = await request(app)
    .post("/task")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({
      description: "Testing",
    })
    .expect(201);

  const task = await Task.findById(response.body._id);
  expect(task).not.toBeNull();
  expect(task.owner).toEqual(userOneId);
  expect(task.compeleted);
});

test("Get all task of User one", async () => {
  const response = await request(app)
    .get("/task")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);

  expect(response.body.length).toBe(2);
});

test("Delete Task Securly", async () => {
  const response = await request(app)
    .delete(`/task/${taskOne._id}`)
    .set("Authorization", `Bearer ${userTwo.tokens[0].token}`)
    .send()
    .expect(404);

  const task = await Task.findById(taskOne._id);
  expect(task).not.toBeNull();
});
