const express = require("express");

const Task = require("../models/Task");

const router = new express.Router();

router.post("/task", async (req, res) => {
  const task = new Task(req.body);
  try {
    await task.save();
    res.status(201).send(task);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.get("/task", async (req, res) => {
  try {
    const tasks = await Task.find({});
    res.send(tasks);
  } catch (e) {
    res.status(500).send(e);
  }
});

router.get("/task/:id", async (req, res) => {
  const _id = req.params.id;
  try {
    const task = await Task.findById(_id);
    if (!task) {
      return res.status(404).send({ error: "Task not found" });
    }
    res.send(task);
  } catch (e) {
    res.status(500).send();
  }
});

router.patch("/task/:id", async (req, res) => {
  const _id = req.params.id;
  const allowedUpdates = ["description", "completed"];
  const requestedUpdates = Object.keys(req.body);
  const isValidUpdate = requestedUpdates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidUpdate) {
    return res.status(400).send({ error: "Invalid Update" });
  }
  try {
    const task = await Task.findByIdAndUpdate(_id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!task) {
      return res.status(404).send();
    }
    res.send(task);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.delete("/task/:id", async (req, res) => {
  const _id = req.params.id;
  try {
    const task = await Task.findByIdAndRemove(_id);
    if (!task) {
      return res.status(404).send();
    }
    res.send(task);
  } catch (e) {
    res.status(500).send();
  }
});

module.exports = router;
