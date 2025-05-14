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

function getGestureEmoji(gesture) {
  switch (gesture) {
    case gestures.THUMBS_UP:
      return "👍";
    case gestures.THUMBS_DOWN:
      return "👎";
    case gestures.VICTORY:
      return "✌️";
    case gestures.POINTING_UP:
      return "☝";
    case gestures.CLOSED_FIST:
      return "✊";
    case gestures.OPEN_PALM:
      return "👋";
    case gestures.LOVE:
      return "🤟";
    case gestures.GESTURE_8:
      return "";
    case gestures.GESTURE_9:
      return "";
  }
}

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
    default:
      return "none";
  }
}

function optionToGesture(option) {
  switch (option) {
    case "move 1":
      return gestures.THUMBS_UP;
    case "switch 2":
      return gestures.THUMBS_DOWN;
    case "move 2":
      return gestures.VICTORY;
    case "move 3":
      return gestures.POINTING_UP;
    case "switch 3":
      return gestures.CLOSED_FIST;
    case "switch 4":
      return gestures.OPEN_PALM;
    case "switch 5":
      return gestures.LOVE;
    case "switch 6":
      return gestures.GESTURE_8;
    case "move 4":
      return gestures.GESTURE_9;
    default:
      return null;
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
          slot: i + 1,
          disabled: move.disabled,
        };
      }),
      party: reqObject.side.pokemon.map((member, i) => {
        return {
          name: member.details.split(",")[0],
          slot: i + 1,
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
          slot: i + 1,
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
          slot: i + 1,
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

function showdownToPokeapi(name) {
  const cosmeticForms = [
    'florges', 'vivillon', 'furfrou', 'alcremie', 'minior', 'tatsugiri', 'squawkabilly',
    'flabebe', 'floette', 'dudunsparce', 'deerling', 'sawsbuck', 'pumpkaboo', 'gourgeist'
  ];

  const genderedForms = {
    'meowstic-f': 'meowstic-female',
    'meowstic-m': 'meowstic-male',
    'indeedee-f': 'indeedee-female',
    'indeedee-m': 'indeedee-male',
    'basculegion-f': 'basculegion-female',
    'basculegion-m': 'basculegion-male'
  };

  const trueForms = {
    'lycanroc-dusk': 'lycanroc-dusk',
    'lycanroc-midnight': 'lycanroc-midnight',
    'lycanroc': 'lycanroc',
    'zygarde-10%': 'zygarde-10',
    'zygarde-complete': 'zygarde-complete',
    'urshifu-rapid-strike': 'urshifu-rapid-strike',
    'urshifu': 'urshifu-single-strike',
    'toxtricity-low-key': 'toxtricity-low-key',
    'toxtricity': 'toxtricity-amped',
    'oricorio-pom-pom': 'oricorio-pom-pom',
    'oricorio-pau': 'oricorio-pau',
    'oricorio-sensu': 'oricorio-sensu',
    'oricorio': 'oricorio-baile',
    'basculin-blue-striped': 'basculin-blue-striped',
    'basculin-white-striped': 'basculin-white-striped',
    'calyrex-ice': 'calyrex-ice',
    'calyrex-shadow': 'calyrex-shadow',
    'giratina-origin': 'giratina-origin',
    'giratina': 'giratina-altered',
    'shaymin-sky': 'shaymin-sky',
    'shaymin': 'shaymin-land',
    'rotom-heat': 'rotom-heat',
    'rotom-wash': 'rotom-wash',
    'rotom-frost': 'rotom-frost',
    'rotom-fan': 'rotom-fan',
    'rotom-mow': 'rotom-mow',
    'rotom': 'rotom'
  };

  name = name
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')  // remove accents
    .replace(/[^a-z0-9]+/g, '-') // replace spaces, apostrophes, colons etc. with hyphen
    .replace(/-$|^-/, '')        // remove leading/trailing hyphens
    .replace('♀', 'f')
    .replace('♂', 'm');

  // Handle special case mappings
  if (genderedForms[name]) return genderedForms[name];
  if (trueForms[name]) return trueForms[name];

  // Strip cosmetic suffixes from known base species
  for (let cosmetic of cosmeticForms) {
    if (name.startsWith(cosmetic + '-')) {
      return cosmetic;
    }
  }

  return name;
}


async function getPokemonSpriteURL(pokemonName, backupImage = false) {
  // const lowercaseName = pokemonName.toLowerCase();
  // const formattedName = lowercaseName.replace(" ", "-");
  const showdownName = showdownToPokeapi(pokemonName);
  const pokemonInfoRequest = await fetch(
    "https://pokeapi.co/api/v2/pokemon/" + showdownName
  )
  // .catch(() => {
  //   return fetch(
  //     "https://pokeapi.co/api/v2/pokemon/" + formattedName.split("-")[0]
  //   );
  // });

  const pokemonSprite = await pokemonInfoRequest
    .json()
    .then((pokemonData) => pokemonData.sprites.front_default)
    .catch(() => {
      if (backupImage) {
        return "img/Pokeball.png";
      } else {
        return "";
      }
    });

  return pokemonSprite;
}
