import {battleStates, gestures, gestureToChoice} from './constants.js';

export const simplifyServerOutput = (serverOutput) => {
    // https://github.com/smogon/pokemon-showdown/blob/master/sim/SIM-PROTOCOL.md#choice-requests
    const obj = JSON.parse(serverOutput.split('|')[2]);

    const simpleObj = {
        active: obj.active[0].moves,
        party: obj.side.pokemon
    }
    
    return simpleObj;
}