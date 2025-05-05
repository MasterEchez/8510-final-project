const Sim = require("pokemon-showdown");
const { battleStates, gestures, gestureToChoice } = require("./constants");
const { simplifySideUpdate } = require("./battle-helper");
const { EventEmitter } = require("events");

const myEmitter = new EventEmitter();
module.exports = myEmitter;

let simState = battleStates.CONFIRM_USERS;

// list of events to animate
let toAnimate = [];

// read from these as Diego updates
let p1_gesture = gestures.THUMBS_UP;
let p2_gesture = gestures.THUMBS_UP;

// update these values so Diego can read from them
let p1_state = {};
let p2_state = {};
const pollForGestures = () => {
  return [p1_gesture, p2_gesture];
};

const getSimState = async () => {
  return simState;
};

(async () => {
  [p1_gesture, p2_gesture] = pollForGestures();
  while (
    !(p1_gesture === gestures.THUMBS_UP && p2_gesture === gestures.THUMBS_UP)
  ) {
    console.log("waiting for both sides to be thumbs up");
    [p1_gesture, p2_gesture] = pollForGestures();
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  simState = battleStates.BATTLE_SHOW;
  const stream = new Sim.BattleStream();

  (async () => {
    for await (const output of stream) {
      const msgParts = output.split("\n");
      // console.log(msgParts);
      switch (msgParts[0]) {
        case "sideupdate":
          const [type, simpleObj] = simplifySideUpdate(msgParts[2]);
          switch (type) {
            case "request":
              if (msgParts[1] === "p1") {
                p1_state = simpleObj;
                myEmitter.emit("p1_state", { message: p1_state });
                console.log(p1_state);
              } else {
                p2_state = simpleObj;
                myEmitter.emit("p2_state", { message: p2_state });
                console.log(p2_state);
              }
              break;
            case "error":
              console.log("error from server output");
              break;
          }
          break;
        case "update":
          console.log(msgParts);
          console.log("generate list of animations, set state to show");
          simState = battleStates.BATTLE_SHOW; //SHOULD BE THIS LINE FOR ACTUAL IMPLEMENTATION
          myEmitter.emit("animate", { message: toAnimate });
          //   simState = battleStates.BATTLE_WAITING; // FOR TESTING
          break;
        default:
          console.log(msgParts[0]);
          break;
      }
      console.log("____\n");
      // console.log(output+"\n____");
    }
  })();

  stream.write(
    `>start {"formatid":"gen9randombattle"}\n` +
      `>player p1 {"name":"Player1"}\n` +
      `>player p2 {"name":"Player2"}`
  );

  // stream.write(`>start {"formatid":"gen7randombattle"}`);
  // stream.write(`>player p1 {"name":"Player1"}`);
  // stream.write(`>player p2 {"name":"Player2"}`);

  // go between waiting => display states and write to stream
  // based on user inputs
  // TODO: remove next two lines eventually
  // setTimeout(() => simState = battleStates.BATTLE_WAITING, 1000);
  setTimeout(() => (simState = battleStates.BATTLE_OVER), 2000);
  while (true) {
    const currentSimState = await getSimState();
    if (currentSimState === battleStates.BATTLE_OVER) {
      break;
    }
    // console.log(`state: ${simState}`);
    [p1_gesture, p2_gesture] = pollForGestures();

    switch (currentSimState) {
      case battleStates.BATTLE_WAITING:
        // try to send moves
        // stream.write(`>p1 move ${gestureToChoice(p1_gesture)}\n` + `>p2 move  ${gestureToChoice(p2_gesture)}`);
        break;
      case battleStates.BATTLE_SHOW:
        // do nothing
        break;
      default:
        break;
    }

    // console.log("__________");
    await new Promise((resolve) => setTimeout(resolve, 200));
  }
})();
