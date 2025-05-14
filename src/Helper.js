const battleStates = {
  CONFIRM_USERS: 0,
  BATTLE_WAITING: 1, // waiting for player moves
  BATTLE_SHOW: 2, // show results of turn
  BATTLE_OVER: 3,
};

const gestures = {
  THUMBS_UP: "Thumb_Up",
  THUMBS_DOWN: "Thumb_Down",
  VICTORY: "Victory",
  POINTING_UP: "Pointing_Up",
  CLOSED_FIST: "Closed_Fist",
  OPEN_PALM: "Open_Palm",
  LOVE: "ILoveYou",
  GESTURE_8: "gesture_8",
  GESTURE_9: "gesture_9",
};

function gestureToOption(gesture) {
  switch (gesture) {
    case gestures.THUMBS_UP:
      return "move 1";
      break;
    case gestures.THUMBS_DOWN:
      return "switch 2";
      break;
    case gestures.VICTORY:
      return "move 2";
      break;
    case gestures.POINTING_UP:
      return "move 3";
      break;
    case gestures.CLOSED_FIST:
      return "switch 3";
      break;
    case gestures.OPEN_PALM:
      return "switch 4";
      break;
    case gestures.LOVE:
      return "switch 5";
      break;
    case gestures.GESTURE_8:
      return "switch 6";
      break;
    case gestures.GESTURE_9:
      return "move 4";
      break;
  }
}

function removeAllChildren(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

function createElementWithText(tag, text) {
  const element = document.createElement(tag);
  const content = document.createTextNode(text);

  element.appendChild(content);
  return element;
}

function parsePlayerState(playerState) {
  const reqObject = playerState.request;
  if (reqObject.active) {
    return {
      type: "active",
      moves: reqObject.active[0].moves.map((move, i) => {
        return {
          move: move.move,
          slot: i,
          disabled: move.disabled,
        };
      }),
      party: reqObject.side.pokemon.map((member, i) => {
        return {
          name: member.details.split(",")[0],
          slot: i,
          condition: member.condition,
          active: member.active,
        };
      }),
    };
  } else if (reqObject.wait) {
    return {
      type: "wait",
      party: reqObject.side.pokemon.map((member, i) => {
        return {
          name: member.details.split(",")[0],
          slot: i,
          condition: member.condition,
          active: member.active,
        };
      }),
    };
  } else if (reqObject.forceSwitch !== undefined) {
    return {
      type: "switch",
      party: reqObject.side.pokemon.map((member, i) => {
        return {
          name: member.details.split(",")[0],
          slot: i,
          condition: member.condition,
          active: member.active,
        };
      }),
    };
  }
}

function splitAnim(splitRest) {
  switch (splitRest[0]) {
    case "-heal":
      return {
        type: "heal",
        player: splitUp[1].slice(0, 2),
        pokemon: splitUp[1].split(" ")[1],
        cause: splitUp[3],
      };
      break;
    case "-damage":
      break;
  }
}

function parseOmniState(omniState) {
  // console.log(omniState);
  const animList = [];
  let splitCountdown = 1;
  let handlingSplit = false;
  omniState.map((el) => {
    const splitUp = el.split("|");
    // console.log(splitUp);
    switch (splitUp[1]) {
      case "move":
        animList.push({
          type: "move",
          player: splitUp[2].slice(0, 2),
          pokemon: splitUp[2].split(" ")[1],
          move: splitUp[3],
        });
        break;
      case "switch":
        if (handlingSplit && splitCountdown == 1) {
          // console.log("A");
          splitCountdown -= 1;
        } else if (handlingSplit && splitCountdown == 0) {
          // console.log("B");
          handlingSplit = false;
          animList.push({
            type: "switch",
            player: splitUp[2].slice(0, 2),
            pokemon: splitUp[3].split(",")[0],
          });
        }
        // console.log("C");
        break;
      case "faint":
        animList.push({
          type: "faint",
          player: splitUp[2].slice(0, 2),
          pokemon: splitUp[2].split(" ")[1],
        });
        break;
      case "split":
        handlingSplit = true;
        splitCountdown = 1;
        break;
      default:
        if (handlingSplit && splitCountdown == 1) {
          splitCountdown -= 1;
        } else if (handlingSplit && splitCountdown == 0) {
          handlingSplit = false;
          // animList.push(splitAnim(splitUp.slice(1)));
        }
        break;
    }

    // if (el === "|split|p1" || el === "|split|p2") {
    //     splitCountdown = 1;
    // } else if (el.includes("switch")) {
    //   if (splitCountdown === 0) {
    //     animList.push(splitData(el))
    //   } else {
    //     splitCountdown -= 1;
    //   }
    // } else if (el.indlud)
  });
  return animList;
}

async function getPokemonSpriteURL(pokemonName) {
  const lowercaseName = pokemonName.toLowerCase();
  const formattedName = lowercaseName.replace(" ", "-");
  const pokemonInfoRequest = await fetch(
    "https://pokeapi.co/api/v2/pokemon/" + formattedName
  );

  const pokemonSprite = await pokemonInfoRequest
    .json()
    .then((pokemonData) => pokemonData.sprites.front_default);

  return pokemonSprite;
}
