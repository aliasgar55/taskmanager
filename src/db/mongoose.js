const mongoose = require("mongoose");
const validator = require("validator");

mongoose.connect("mongodb://127.0.0.1:27017/task-manager-api", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

const User = mongoose.model("User", {
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Invalid Email");
      }
    },
  },
  age: {
    type: Number,
    default: 18,
    validate(value) {
      if (value < 0) {
        throw new Error("Invalid age");
      }
    },
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 7,
    validate(value) {
      if (value.length <= 6) {
        throw new Error("password too short");
      } else if (value.includes("password")) {
        throw new Error("password too weak");
      }
    },
  },
});

const Task = mongoose.model("Task", {
  description: {
    required: true,
    type: String,
    trim: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
});

const user = new User({
  name: "    Ali     ",
  email: "AlI@kuwar.tk",
  age: 18,
  password: "passw",
});

const task = new Task({
  description: "complete the module",
  completed: false,
});

user
  .save()
  .then((result) => console.log(result))
  .catch((e) => console.log(e));

task
  .save()
  .then((result) => console.log(result))
  .catch((e) => console.log("Our Error: " + e));
