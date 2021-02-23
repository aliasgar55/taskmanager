const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const User = require("../../src/models/User");
const Task = require("../../src/models/Task");

const userOneId = new mongoose.Types.ObjectId();
const userOne = {
  _id: userOneId,
  email: "testuser1@testmail.com",
  password: "test123",
  name: "testUser1",
  tokens: [
    {
      token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET),
    },
  ],
};

const userTwoId = new mongoose.Types.ObjectId();
const userTwo = {
  _id: userTwoId,
  email: "testuser2@testmail.com",
  password: "test123",
  name: "testUser2",
  tokens: [
    {
      token: jwt.sign({ _id: userTwoId }, process.env.JWT_SECRET),
    },
  ],
};

const taskOne = {
  _id: new mongoose.Types.ObjectId(),
  description: "Task One",
  completed: false,
  owner: userOneId,
};

const taskTwo = {
  _id: new mongoose.Types.ObjectId(),
  description: "Task Two",
  completed: true,
  owner: userTwoId,
};

const taskThree = {
  _id: new mongoose.Types.ObjectId(),
  description: "Task Three",
  completed: true,
  owner: userOneId,
};

const setupDatabase = async () => {
  await User.deleteMany();
  await Task.deleteMany();
  await new User(userOne).save();
  await new User(userTwo).save();
  await new Task(taskOne).save();
  await new Task(taskTwo).save();
  await new Task(taskThree).save();
};

module.exports = {
  userOneId,
  userOne,
  userTwo,
  taskOne,
  setupDatabase,
};
