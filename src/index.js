const express = require("express");
require("./db/mongoose");
const User = require("./models/User");
const Task = require("./models/Task");
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.post("/user", (req, res) => {
  const user = new User(req.body);
  user
    .save()
    .then((result) => res.status(201).send(result))
    .catch((e) => res.status(400).send(e));
});

app.post("/task", (req, res) => {
  const task = new Task(req.body);
  task
    .save()
    .then((result) => res.status(201).send(result))
    .catch((e) => res.status(400).send(e));
});

app.get("/user", (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch((e) => res.status(500));
});

app.get("/user/:id", (req, res) => {
  const _id = req.params.id;
  User.findById(_id)
    .then((user) => {
      if (!user) {
        return res.status(404).send();
      }
      return res.send(user);
    })
    .catch((e) => res.status(500).send());
});

app.listen(port, () => {
  console.log("Server running on port " + port);
});
