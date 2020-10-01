const express = require("express");
const serveStatic = require("serve-static");
const path = require("path");

const app = express();

const port = process.env.PORT || 8080;

// app.all("/", serveStatic(path.join(__dirname, "./dist")));
app.use("/", serveStatic(path.join(__dirname, "./dist")));
app.listen(port);

app.get("/", (req, res) => {
  res.send("hello world");
});

console.log(`Listening on port : ${port}`);
