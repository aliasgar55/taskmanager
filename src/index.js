const express = require("express");
require("./db/mongoose");
const userRouter = require("./routes/user");
const taskRouter = require("./routes/task");

const app = express();

const port = process.env.PORT || 3000;

// app.use((req, res, next) => res.status(503).send("site is under maintainance"));

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

app.listen(port, () => {
  console.log("Server running on port " + port);
});
