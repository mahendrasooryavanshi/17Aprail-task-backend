const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const config = require("./config/config");
app.use(cors());
app.use(bodyParser.json({ type: "application/json" }));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse some custom thing into a Buffer
app.use(bodyParser.raw({ type: "application/vnd.custom-type" }));

app.get("/", async (req, res) => {
  res.send("server is working");
});
app.use("/api", require("./router/appRouter"));

app.listen(3000);
console.log("app is listing at the server http://localhost:3000");
