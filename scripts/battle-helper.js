import {battleStates, gestures, gestureToChoice} from './constants.js';

export const simplifySideUpdate = (serverOutput) => {
    // https://github.com/smogon/pokemon-showdown/blob/master/sim/SIM-PROTOCOL.md#choice-requests
    const [_, type, preparsed] = serverOutput.split('|');
    const obj = JSON.parse(preparsed);
    let simpleObj = {};
    console.log(serverOutput);

    switch (type) {
        case 'request':
            simpleObj = {
                active: obj.active[0].moves,
                party: obj.side.pokemon
            };
            break;
        case 'error':
            break;
        default:
            console.log(`battle helper weird type: ${type}`);
            break;
    }
    
    return [type, simpleObj];
}