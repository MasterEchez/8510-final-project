const express = require("express");
const Sim = require("pokemon-showdown");
const {
  battleStates,
  gestures,
  gestureToChoice,
} = require("../scripts/constants");
const { simplifySideUpdate } = require("../scripts/battle-helper");

simState = battleStates.BATTLE_SHOW;
const stream = new Sim.BattleStream();
const streams = new Sim.getPlayerStreams(stream);
const p1Stream = streams.p1;
const p2Stream = streams.p2;
const omniStream = streams.omniscient;

let getState = async () => {
  let p1 = (await p1Stream.next()).value;
  let p2 = (await p2Stream.next()).value;
  let omni = (await omniStream.next()).value;
  return { p1, p2, omni };
};

//
//
//
// SERVER STARTED
const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/start", async (req, res) => {
  // start rand bat, return data
  stream.write(
    `>start {"formatid":"gen9randombattle"}\n` +
      `>player p1 {"name":"Player1"}\n` +
      `>player p2 {"name":"Player2"}`
  );
  const msg = await getState();
  console.log(msg);
  res.send(msg);
});

app.post("/moves", (req, res) => {
  // writes moves to stream and returns output
  res.send("moves");
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
