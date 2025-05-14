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
  }

  updatePlayersReady() {
    return this.player1Done && this.player2Done;
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

  checkPlayerGestures() {
    //get player gestures
    return [this.player1Gesture, this.player2Gesture];
  }

  updatePlayerActions() {}

  isStateDone() {}

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
    topHUDPlayer.setAttribute("class", "top-battle-hud");
    bottomHUDPlayer.setAttribute("class", "bottom-battle-hud");

    // variables
    const activePokemon = playerBattleState.party.find(
      (pokemon) => pokemon.active
    );
    const activePokemonMoves = playerBattleState.moves;
    const activePokemonSprite = getPokemonSpriteURL(activePokemon.name); //needs to be awaited
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
    // for (const move of activePokemonMoves) {
    for (let i = 0; i < activePokemonMoves.length; i++) {
      const move = activePokemonMoves[i];
      const gesture = moveGestures[i];
      const emoji = getGestureEmoji(gesture);

      // elements
      const moveElement = document.createElement("div");
      moveElement.setAttribute("class", "move");
      if (move.disabled) {
        moveElement.setAttribute("class", "disabled");
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
    for (const pokemon of restingPokemon) {
      const switchElement = document.createElement("img");
      const pokemonSprite = getPokemonSpriteURL(pokemon.name); //needs to be awaited
      switchElement.setAttribute("src", await pokemonSprite);
      switchElement.setAttribute("alt", pokemon.name);
      switchElement.setAttribute("class", "resting-pokemon");
      if (pokemon.condition[0] === "0") {
        //if pokemon has fainted
        switchElement.setAttribute("class", "fainted");
      }

      possiblePokemonSwitchesContainer.appendChild(switchElement);
    }

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
