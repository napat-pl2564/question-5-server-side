const express = require("express");
const app = express();
const port = 3000;
const { loadLastestState, saveLastestState } = require("./src/authen");
app.use(express.json());
app.get("/calculator/load", (request, response) => {
  try {
    loadLastestState(response);
  } catch (error) {
    console.log(error);
    response.send(error);
  }
});
app.post("/calculator/save", (request, response) => {
  try {
    saveLastestState(request, response);
  } catch (error) {
    console.log(error);
    response.send(error);
  }
});
app.listen(port, () => {
  console.log(`Start app on port : ${port}`);
});
