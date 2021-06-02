const express = require("express");
const cors = require("cors");
const fetch = require('node-fetch');
const app = express();

const PORT = 3000;

app.use(express.json());
app.use(cors());
app.use(express.static(__dirname));

const connect = async () => {
  app.listen(PORT, () => console.log(`Server is running on ${PORT}`));
};

const checkWord = async (req, res, next) => {
  const word = req.params.word;
  let response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en_GB/${word}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
  res.result = await response.json();
  next();
};

const outputResult = (req, res, next) => {
  console.log(res.result);
};

app.get("/api/:word", checkWord, outputResult);

connect();
