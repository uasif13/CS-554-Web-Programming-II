const express = require("express");
const app = express();
const session = require("express-session");
const configRoutes = require("./routes");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
let dict = {};

app.use(
  session({
    name: "AuthCookie",
    secret: "some secret string",
    resave: false,
    saveUninitialized: true,
    paths: {},
  })
);

app.use((req, res, next) => {
  if (!req.session.reqCount) {
    req.session.reqCount = 1;
  } else {
    req.session.reqCount += 1;
  }
  next();
});

app.use((req, res, next) => {
  if (
    req.body &&
    (req.method === "POST" || req.method === "PUT" || req.method === "PATCH")
  ) {
    // Not sure if it is req.path or req.url
    console.log(
      `HTTP Verb: ${req.method},  Path Requested: ${req.protocol}://${req.get(
        "host"
      )}${req.originalUrl}, Request Body: ${JSON.stringify(req.body)}`
    );
  }
  next();
});

app.use((req, res, next) => {
  if (req.path in dict) {
    dict[req.path] += 1;
  } else {
    dict[req.path] = 1;
  }
  console.log(
    `Path Requested: ${req.protocol}://${req.get("host")}${
      req.originalUrl
    } Times Requested: ${dict[req.path]}`
  );
  next();
});
configRoutes(app);

app.listen(3000, () => {
  console.log("Server is running");
});
