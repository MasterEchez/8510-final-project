import {battleStates, gestures, gestureToChoice} from './constants.js';

export const simplifyServerOutput = (serverOutput) => {
    const obj = JSON.parse(serverOutput.split('|')[2]);

    const simpleObj = {
        active: obj.active[0].moves,
        party: obj.side.pokemon
    }
    
    return simpleObj;
}