const mongoose = require("mongoose").set("strictQuery", true);
var url = "mongodb://localhost:27017/17April";

try {
  mongoose.connect(url);
  console.log("Database connected successfully");
} catch (error) {
  console.log("Db connection error________________");
  console.log(error);
}
