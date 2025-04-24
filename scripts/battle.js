const Sim = require('pokemon-showdown');
const {battleStates, gestures, gestureToChoice} = require('./constants');

let simState = battleStates.CONFIRM_USERS;
let p1_gesture = null;
let p2_gesture = null;
const pollForGestures = () => { // should come from Diego module
    return [gestures.THUMBS_UP, gestures.THUMBS_UP];
}

( async () => {
    while (!(p1_gesture === gestures.THUMBS_UP && p2_gesture === gestures.THUMBS_UP)) {
        console.log("waiting for both sides to be thumbs up");
        [p1_gesture, p2_gesture] = pollForGestures();
        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    simState = battleStates.BATTLE_WAITING;
    const stream = new Sim.BattleStream();

    (async () => {
        for await (const output of stream) {
            if (output.includes('end')) {
                simState = battleStates.BATTLE_OVER;
            }
            console.log(output);
        }
    })();

    stream.write(`>start {"formatid":"gen7randombattle"}`);
    stream.write(`>player p1 {"name":"Player1"}`);
    stream.write(`>player p2 {"name":"Player2"}`);
})();
