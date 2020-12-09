const mongoose = require("mongoose");
const Tasks = mongoose.model("Tasks", {
  description: {
    type: String,
    required: true,
    trim: true,
    minlenght: 3,
  },
  completed: {
    type: Boolean,
    default: false,
  },
});
