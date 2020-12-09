const express = require("express");
require("./db/mongoose.js");
const User = require("./models/User.js");
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.post("/User", (req, res) => {
  const user = new User(req.body);
  user
    .save()
    .then((result) => {
      res.send(result);
    })
    .catch((e) => res.status(400).send(e));
});

app.listen(port, () => {
  console.log("Server running on port " + port);
});
