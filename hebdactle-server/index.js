const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
const port = 3003;

app.get("/article", (req, res) => {
  //
  const fs = require("fs");
  const articleNames = JSON.parse(fs.readFileSync(".article-list.txt", "utf8"));
  // const randomarticleName =
  //   articleNames[Math.floor(Math.random() * articleNames.length)];
  const startDate = new Date("09/01/2022");
  const curDate = new Date();
  const diffTime = Math.abs(curDate - startDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const title = articleNames[diffDays].slice(0, -5);
  const text = fs.readFileSync("./data/" + articleNames[diffDays]).toString();
  res.send({ title, text });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
