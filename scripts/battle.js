const Sim = require('pokemon-showdown');
const {battleStates, gestures, gestureToChoice} = require('./constants');
const {simplifyServerOutput} = require('./battle-helper');

let simState = battleStates.CONFIRM_USERS;
let p1_gesture = null;
let p2_gesture = null;
let p1_state = {};
let p2_state = {};
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
            const msgParts = output.split("\n");
            // console.log(msgParts);
            switch(msgParts[0]) {
                case 'sideupdate':
                    const [type, simpleObj] = simplifyServerOutput(msgParts[2]);
                    switch (type) {
                        case 'request':
                            if (msgParts[1] === 'p1') {
                                p1_state = simpleObj;
                                console.log(p1_state);
                            } else {
                                p2_state = simpleObj;
                                console.log(p2_state);
                            }
                            break;
                        case 'error':
                            console.log("error from server output");
                            break;
                    }
                    break;
                default:
                    console.log(msgParts[0]);
                    break;
            }
            console.log("____\n");
            // console.log(output+"\n____");
        }
    })();

    stream.write(`>start {"formatid":"gen9randombattle"}\n` +
        `>player p1 {"name":"Player1"}\n` +
        `>player p2 {"name":"Player2"}`);

    // stream.write(`>start {"formatid":"gen7randombattle"}`);
    // stream.write(`>player p1 {"name":"Player1"}`);
    // stream.write(`>player p2 {"name":"Player2"}`);

    // go between waiting => display states and write to stream
    // based on user inputs
})();
