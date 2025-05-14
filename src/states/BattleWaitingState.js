class BattleWaitingState {
  constructor(player1BattleState, player2BattleState, omniBattleState) {
    this.player1BattleState = player1BattleState;
    this.player2BattleState = player2BattleState;
    this.omniBattleState = omniBattleState;
    this.player1Done = false;
    this.player2Done = false;
    this.player1Action;
    this.player2Action;
    this.player1Gestures = [];
    this.player2Gestures = [];
    this.p1Parsed = parsePlayerState(this.player1BattleState);
    this.p2Parsed = parsePlayerState(this.player2BattleState);
  }

  get stateName() {
    return battleStates.BATTLE_WAITING;
  }

  updateState(player1Gestures, player2Gestures) {
    this.player1Gestures = player1Gestures.slice();
    this.player2Gestures = player2Gestures.slice();
    // map gestures to move
    this.updatePlayerReadiness();
  }

  checkPlayersReady() {
    return this.player1Done && this.player2Done;
  }

  updatePlayerDone(playerNumber, action) {
    let playerBattleState;
    if (playerNumber === 1) {
      playerBattleState = this.p1Parsed;
    } else if (playerNumber === 2) {
      playerBattleState = this.p2Parsed;
    }

    if (playerNumber === 1) {
      this.player1Action = action;
    } else {
      this.player2Action = action;
    }
    const [actionType, selection] = action.split(" ");
    const choice = Number(selection);
    switch (playerBattleState.type) {
      case "active":
        if (actionType === "move") {
          const move = playerBattleState.moves.filter(
            (move) => move.slot === choice
          );
          if (move.length !== 0 && !move[0].disabled) {
            return true;
          }
        } else if (actionType === "switch") {
          if (
            !playerBattleState.party[choice].active &&
            !playerBattleState.party[choice].condition[0] !== "0"
          ) {
            return true;
          }
        }
        return false;
        break;
      case "wait":
        if (playerNumber === 1) {
          this.player1Action = "";
        } else {
          this.player2Action = "";
        }
        return true;
        break;
      case "switch":
        if (actionType === "move") {
          return false;
        } else if (actionType === "switch") {
          const choice = Number(selection);
          if (
            !playerBattleState.party[choice].active &&
            !playerBattleState.party[choice].condition[0] !== "0"
          ) {
            return true;
          }
        }
        return false;
        break;
    }
  }

  updatePlayerReadiness() {
    // poll for gesture
    this.player1Done = this.updatePlayerDone(
      1,
      gestureToOption(this.player1Gestures[0])
    );
    this.player2Done = this.updatePlayerDone(
      2,
      gestureToOption(this.player2Gestures[0])
    );

    console.log(
      `p1 done: ${this.player1Done}, ` +
        `p1 action: ${this.player1Action}, ` +
        `p2 done: ${this.player2Done}, ` +
        `p2 action: ${this.player2Action}`
    );
  }

  isOver() {
    return this.checkPlayersReady();
  }

  async display() {
    // console.log(this.p1Parsed);
    // console.log(this.p2Parsed);
    const hud = document.getElementById("hud");
    const players = document.getElementById("players");

    const header = createElementWithText("h1", "Make gesture for move/switch");

    hud.insertBefore(header, players);

    // Rest of HUD
    this.preparePlayerDisplay(1);
    this.preparePlayerDisplay(2);
  }

  async preparePlayerDisplay(playerNumber) {
    const moveGestures = [
      gestures.THUMBS_UP,
      gestures.THUMBS_DOWN,
      gestures.VICTORY,
      gestures.POINTING_UP,
    ];
    const switchingGestures = [
      gestures.CLOSED_FIST,
      gestures.OPEN_PALM,
      gestures.LOVE,
      gestures.GESTURE_8,
      gestures.GESTURE_9,
    ];

    const playerElement = document.getElementById(`player${playerNumber}`);
    let playerBattleState;
    if (playerNumber === 1) {
      playerBattleState = this.p1Parsed;
    } else if (playerNumber === 2) {
      playerBattleState = this.p2Parsed;
    }

    const topHUDPlayer = document.createElement("div");
    const bottomHUDPlayer = document.createElement("div");
    topHUDPlayer.classList.add("top-battle-hud");
    bottomHUDPlayer.classList.add("bottom-battle-hud");

    // variables
    const activePokemon = playerBattleState.party.find(
      (pokemon) => pokemon.active
    );
    const activePokemonMoves = playerBattleState.moves;
    const activePokemonSprite = getPokemonSpriteURL(activePokemon.name, true); //needs to be awaited
    const restingPokemon = playerBattleState.party.filter(
      (pokemon) => !pokemon.active
    );

    //elements
    const activePokemonNameElement = createElementWithText(
      "h2",
      activePokemon.name
    );
    activePokemonNameElement.classList.add("pokemon-name");
    const activePokemonHPElement = createElementWithText(
      "h3",
      activePokemon.condition
    );
    activePokemonHPElement.classList.add("pokemon-hp");
    const activePokemonMovesContainer = document.createElement("div");
    activePokemonMovesContainer.setAttribute("id", "moves");
    for (let i = 0; i < activePokemonMoves.length; i++) {
      const move = activePokemonMoves[i];
      const gesture = moveGestures[i];
      const emoji = getGestureEmoji(gesture);

      // elements
      const moveElement = document.createElement("div");
      moveElement.classList.add("move");
      if (move.disabled) {
        moveElement.classList.add("disabled");
      }

      const moveNameElement = createElementWithText("p", move.move);
      moveNameElement.classList.add("move-name");

      const moveEmojiElement = createElementWithText("p", emoji);
      moveEmojiElement.classList.add("move-emoji");

      moveElement.appendChild(moveNameElement);
      moveElement.appendChild(moveEmojiElement);
      activePokemonMovesContainer.appendChild(moveElement);
    }

    const activePokemonSpriteElement = document.createElement("img");
    if (playerNumber === 1) {
      activePokemonSpriteElement.classList.add("mirror");
    }
    activePokemonSpriteElement.setAttribute("src", await activePokemonSprite);
    activePokemonSpriteElement.setAttribute("alt", activePokemon.name);
    activePokemonSpriteElement.classList.add("sprite");

    const possiblePokemonSwitchesContainer = document.createElement("div");
    for (let i = 0; i < restingPokemon.length; i++) {
      const pokemon = restingPokemon[i];
      const pokemonSprite = getPokemonSpriteURL(pokemon.name); //needs to be awaited
      const gesture = switchingGestures[i];
      const emoji = getGestureEmoji(gesture);

      // elements
      const switchElement = document.createElement("div");
      if (pokemon.condition[0] === "0") {
        //if pokemon has fainted
        switchElement.classList.add("fainted");
      }
      const pokemonSpriteElement = document.createElement("img");
      pokemonSpriteElement.setAttribute("src", await pokemonSprite);
      pokemonSpriteElement.setAttribute("alt", pokemon.name);
      pokemonSpriteElement.classList.add("resting-pokemon");
      const pokemonEmojiElement = createElementWithText("p", emoji);
      pokemonEmojiElement.classList.add("switching-emoji");

      switchElement.appendChild(pokemonSpriteElement);
      switchElement.appendChild(pokemonEmojiElement);
      possiblePokemonSwitchesContainer.appendChild(switchElement);
    }
    possiblePokemonSwitchesContainer.classList.add("switching-container");

    topHUDPlayer.appendChild(activePokemonNameElement);
    topHUDPlayer.appendChild(activePokemonHPElement);
    topHUDPlayer.appendChild(activePokemonMovesContainer);
    bottomHUDPlayer.appendChild(activePokemonSpriteElement);
    bottomHUDPlayer.appendChild(possiblePokemonSwitchesContainer);

    playerElement.appendChild(topHUDPlayer);
    playerElement.appendChild(bottomHUDPlayer);
    playerElement.style.justifyContent = "space-between";
  }
}
