const express = require("express");
const Sim = require("pokemon-showdown");
const {
  battleStates,
  gestures,
  gestureToChoice,
} = require("../scripts/constants");
const { simplifySideUpdate } = require("../scripts/battle-helper");

let simState = battleStates.CONFIRM_USERS;

// list of events to animate
let toAnimate = [];

//
//
//
// SERVER STARTED
const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/getPlayerStates", (req, res) => {
  res.send("Player states");
});

app.post("start", (req, res) => {
  // start rand bat, return data
  res.send("update");
});

app.post("gestures", (req, res) => {
  // record gestures, update state machine, return relevant update
  res.send("update");
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
