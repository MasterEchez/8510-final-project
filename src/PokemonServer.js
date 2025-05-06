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
  console.log("here");
  let p1 = (await p1Stream.next()).value;
  let p2 = (await p2Stream.next()).value;
  let omni = (await omniStream.next()).value;
  console.log(p1);
  console.log(p2);
  console.log(omni);
  return { p1, p2, omni };
};

//
//
//
// SERVER STARTED
const app = express();
app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
const port = 3000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/start", async (req, res) => {
  // start rand bat, return data
  await stream.write(
    `>start {"formatid":"gen9randombattle"}\n` +
      `>player p1 {"name":"Player1"}\n` +
      `>player p2 {"name":"Player2"}`
  );
  const msg = await getState();
  console.log(msg);
  res.send(msg);
});

app.post("/moves", async (req, res) => {
  // writes moves to stream and returns output
  let body = req.body;
  console.log(body);
  await stream.write(
    `>p1 ${body.p1}\n` + `>p2 ${body.p2}`
  );
  const msg = await getState();
  res.send(msg);
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
