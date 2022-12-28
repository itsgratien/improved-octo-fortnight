const express = require("express");
const jwt = require("jsonwebtoken");

const app = express();

const port = 9000;

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

const users = [
  {
    id: 1,
    username: "gratien",
    password: "hacker@12",
  },
  {
    id: 2,
    username: "arsene",
    password: "hacker@12",
  },
];

const secretKey = "happy";

app.post("/auth/login", (req, res) => {
  const { username, password } = req.body;

  const findUser = users.find((item) => item.username === username);

  if (!findUser) {
    return res.json({ status: 401, message: "wrong credentials" });
  }

  if (findUser.password !== password) {
    return res.json({ status: 401, message: "unknown password" });
  }

  const token = jwt.sign({ id: findUser.id }, secretKey, { expiresIn: "2h" });
  return res.json({
    data: { username: req.body.username, password: req.body.password },
    token,
  });
});

const isAuth = (req, res, next) => {
  const token = req.headers.authorization;

  const verify = jwt.verify(token, secretKey);

  if (verify) {
    console.log("verify", verify);
    return next();
  } else {
    return res.json({ status: 401, message: "unauthorized access" });
  }
};

app.post("/notify", isAuth, (req, res) => {
  console.log("notificationBody:", req.body);

  return res.json({ message: "notified successfully" });
});

app.listen(port, () => console.log("app started on port: ", port));
