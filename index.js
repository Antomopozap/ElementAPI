const express = require("express");
const app = express();
const PORT = 8080;
const db = require("megadb");
const keys = new db.crearDB("keys");
const users = new db.crearDB("users");

function generateApiKey(user) {
  const { randomBytes, createHash } = require("crypto");
  const apiKey = randomBytes(16).toString("hex");
  const incriptedKey = createHash("md5").update(apiKey).digest("hex");

  if (keys.has(incriptedKey)) {
    generateApiKey();
  }
  if (users.has(user)) {
    console.log("Username already taken");
  } else {
    keys.set(incriptedKey, user);
    users.set(user, incriptedKey);
    console.log(`Key generated succesfully, ${apiKey}`);
  }
}

app.get("/api", (req, res) => {
  const { createHash } = require("crypto");
  const apiKey = req.query.apiKey;

  if (!apiKey) res.sendStatus(400);
  const incryptedKey = createHash("md5").update(apiKey).digest("hex");
  if (!keys.has(incryptedKey)) res.sendStatus(400);

  fetch("http://example.com/movies.json")
    .then((response) => response.json())
    .then((data) => console.log(data));
});

app.listen(PORT, () => {
  console.log("Server runnig at http://localhost:" + PORT);
});
