const express = require("express");
const Sim = require("pokemon-showdown");
const {
  battleStates,
  gestures,
  gestureToChoice,
} = require("../scripts/constants");
const { simplifySideUpdate } = require("../scripts/battle-helper");

const stream = new Sim.BattleStream();

let [p1_updated, p2_updated, omni_updated] = [false, false, false];

let p1 = "";
let p2 = "";
let omni = "";

const p1_updated_promise = async () => {
  while (!p1_updated) {
    await new Promise((resolve) => setTimeout(resolve, 200));
  }
  return;
};

const p2_updated_promise = async () => {
  while (!p2_updated) {
    await new Promise((resolve) => setTimeout(resolve, 200));
  }
  return;
};

const omni_updated_promise = async () => {
  while (!omni_updated) {
    await new Promise((resolve) => setTimeout(resolve, 200));
  }
  return;
};

let getState = async () => {
  console.log("________");
  console.log("here");
  await Promise.all([
    p1_updated_promise(),
    p2_updated_promise(),
    omni_updated_promise(),
  ]);
  return { p1, p2, omni };
};

(async () => {
  for await (const output of stream) {
    const msgParts = output.split("\n");
    switch (msgParts[0]) {
      case "sideupdate":
        const [_, type, objStr] = msgParts[2].split("|");
        if (msgParts[1] === "p1") {
          p1 = {};
          p1[type] =  JSON.parse(objStr);
          p1_updated = true;
          // console.log(p1);
        } else {
          p2 = {};
          p2[type] =  JSON.parse(objStr);
          p2_updated = true;
          // console.log(p2);
        }
        break;
      case "update":
        omni = msgParts;
        omni_updated = true;
        // console.log(msgParts);
        break;
      default:
        console.log(output);
        break;
    }
  }
})();

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
  [p1_updated, p2_updated, omni_updated] = [false, false, false];
  await stream.write(
    `>start {"formatid":"gen9randombattle"}\n` +
      `>player p1 {"name":"Player1"}\n` +
      `>player p2 {"name":"Player2"}`
  );
  const msg = await getState();
  // console.log(msg);
  res.send(msg);
});

app.post("/moves", async (req, res) => {
  // writes moves to stream and returns output
  let body = req.body;
  // console.log(body);
  [p1_updated, p2_updated, omni_updated] = [false, false, false];
  const p1_part = body.p1 ? `>p1 ${body.p1}\n` : "";
  const p2_part = body.p2 ? `>p2 ${body.p2}` : "";
  await stream.write(p1_part + p2_part);
  const msg = await getState();
  // console.log(msg);
  res.send(msg);
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
