const express = require("express");
const multer = require("multer");
const sharp = require("sharp");

const User = require("../models/User");

const auth = require("../middleware/auth");

const { sendWelcomeEmail, sendCancelEmail } = require("../emails/account");

const router = new express.Router();

router.post("/user", async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    sendWelcomeEmail(user.name, user.email);
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (e) {
    res.status(400).send(e);
  }
});

router.post("/user/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findByCredentials(email, password);
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (e) {
    res.status(400).send();
  }
});

router.post("/user/logout", auth, async (req, res) => {
  req.user.tokens = req.user.tokens.filter((token) => {
    return req.token !== token.token;
  });
  await req.user.save();
  res.send();
});

router.post("/user/logoutall", auth, async (req, res) => {
  req.user.tokens = [];
  await req.user.save();
  res.send();
});

router.get("/user/me", auth, async (req, res) => {
  res.send(req.user);
});

router.patch("/user/me", auth, async (req, res) => {
  const allowedUpdates = ["name", "email", "password", "age"];
  const updates = Object.keys(req.body);
  const isValidUpdate = updates.every((update) =>
    allowedUpdates.includes(update)
  );
  if (!isValidUpdate) {
    return res.status(400).send({ error: "Invalid update!" });
  }
  try {
    const user = req.user;
    updates.forEach((update) => (user[update] = req.body[update]));
    await user.save();
    res.send(user);
  } catch (e) {
    console.log(e);
    res.status(400).send(e);
  }
});

router.delete("/user/me", auth, async (req, res) => {
  try {
    await req.user.remove();
    sendCancelEmail(req.user.name, req.user.email);
    res.send(req.user);
  } catch (e) {
    console.log(e);
    res.status(500).send();
  }
});

const upload = multer({
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(png|jpeg|jpg)$/)) {
      return cb(new Error("Please Upload an image"));
    }
    cb(undefined, true);
  },
});
router.post(
  "/user/me/avatar",
  auth,
  upload.single("avatar"),
  async (req, res) => {
    const buffer = await sharp(req.file.buffer)
      .resize({ width: 250, height: 250 })
      .png()
      .toBuffer();
    req.user.avatar = buffer;
    await req.user.save();
    res.send();
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

router.delete(
  "/user/me/avatar",
  auth,
  async (req, res) => {
    req.user.avatar = undefined;
    await req.user.save();
    res.send();
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

router.get("/user/:id/avatar", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user || !user.avatar) {
      throw new Error("No user avatar exits");
    }
    res.set("Content-type", "image/jpg");
    res.send(user.avatar);
  } catch (e) {
    res.status(404).send(e.message);
  }
});
module.exports = router;
