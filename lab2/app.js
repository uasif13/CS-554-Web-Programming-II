const express = require("express");
const app = express();
const path = require("path");
const static = express.static(__dirname + "/public");

app.use("/public", static);

app.get("/", (req, res) => {
  res.sendFile(path.resolve("./public/index.html"));
});
app.use("*", (req, res) => {
  res.status(404).json({ error: "Please go to the / page" });
});
app.listen(3000, () => {
  console.log("Server is running: http://localhost:3000");
});
