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
    // const player1 = document.getElementById("player1");
    // const player2 = document.getElementById("player2");

    // const topHUDPlayer1 = document.createElement("div");
    // const bottomHUDPlayer1 = document.createElement("div");
    // topHUDPlayer1.setAttribute("class", "top-battle-hud");
    // bottomHUDPlayer1.setAttribute("class", "bottom-battle-hud");

    // const topHUDPlayer2 = document.createElement("div");
    // const bottomHUDPlayer2 = document.createElement("div");
    // topHUDPlayer2.setAttribute("class", "top-battle-hud");
    // bottomHUDPlayer2.setAttribute("class", "bottom-battle-hud");

    // let player1PokemonName;
    // let player1PokemonHP;
    // let player1PokemonMoves;
    // let player1PokemonSwitches;
    // let player2PokemonName;
    // let player2PokemonHP;
    // let player2PokemonMoves;
    // let player2PokemonSwitches;

    // const player1PokemonSpriteElement = document.createElement("img");
    // const player2PokemonSpriteElement = document.createElement("img");
    // player1PokemonSpriteElement.setAttribute("id", "p1-pokemon-sprite");

    // // Player 1
    // const player1ActivePokemon = this.p1Parsed.party.find(
    //   (pokemon) => pokemon.active
    // );
    // const player1ActivePokemonMoves = this.p1Parsed.moves;
    // const player1OtherPokemon = this.p1Parsed.party.filter(
    //   (pokemon) => !pokemon.active
    // );

    // player1PokemonName = createElementWithText("h2", player1ActivePokemon.name);
    // player1PokemonHP = createElementWithText(
    //   "div",
    //   player1ActivePokemon.condition
    // );
    // player1PokemonMoves = document.createElement("div");
    // for (const move of player1ActivePokemonMoves) {
    //   const moveElement = createElementWithText("div", move.move);
    //   moveElement.setAttribute("class", "move");
    //   if (move.disabled) {
    //     moveElement.setAttribute("class", "disabled");
    //   }

    //   player1PokemonMoves.appendChild(moveElement);
    // }
    // const player1PokemonSpriteRequest = await fetch(
    //   "https://pokeapi.co/api/v2/pokemon/" +
    //     player1ActivePokemon.name.toLowerCase()
    // );
    // const player1PokemonSprite = await player1PokemonSpriteRequest
    //   .json()
    //   .then((pokemonData) => pokemonData.sprites.front_default);
    // player1PokemonSpriteElement.setAttribute("src", player1PokemonSprite);
    // player1PokemonSpriteElement.setAttribute("class", "sprite");
    // player1PokemonSwitches = document.createElement("div");
    // for (const pokemonSwitch of player1OtherPokemon) {
    //   const switchElement = createElementWithText("div", pokemonSwitch.name);
    //   //get sprite (write helper function)
    //   switchElement.setAttribute("class", "resting-pokemon");
    //   if (pokemonSwitch.condition[0] === "0") {
    //     //if pokemon has fainted
    //     switchElement.setAttribute("class", "fainted");
    //   }

    //   player1PokemonSwitches.appendChild(switchElement);
    // }

    // topHUDPlayer1.appendChild(player1PokemonName);
    // topHUDPlayer1.appendChild(player1PokemonHP);
    // topHUDPlayer1.appendChild(player1PokemonMoves);
    // bottomHUDPlayer1.appendChild(player1PokemonSpriteElement);
    // bottomHUDPlayer1.appendChild(player1PokemonSwitches);

    // player1.appendChild(topHUDPlayer1);
    // player1.appendChild(bottomHUDPlayer1);
    // player1.style.justifyContent = "space-between";

    // get gesture
    // const [p1, p2] = this.checkPlayerGestures();
    // const p1_gesture = createElementWithText("span", p1);
    // player1.appendChild(p1_gesture);

    // get gesture
    // const p2_gesture = createElementWithText("span", p2);
    // player2.appendChild(p2_gesture);
  }

  async preparePlayerDisplay(playerNumber) {
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

    // elements
    // let activePokemonName;
    // let activePokemonHP;
    // let activePokemonMovesContainer;
    // let restingPokemonContainer;

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
    const activePokemonHPElement = createElementWithText(
      "div",
      activePokemon.condition
    );
    const activePokemonMovesContainer = document.createElement("div");
    for (const move of activePokemonMoves) {
      const moveElement = createElementWithText("div", move.move);
      moveElement.setAttribute("class", "move");
      if (move.disabled) {
        moveElement.setAttribute("class", "disabled");
      }

      activePokemonMovesContainer.appendChild(moveElement);
    }

    // const player1PokemonSpriteRequest = await fetch(
    //   "https://pokeapi.co/api/v2/pokemon/" +
    //     player1ActivePokemon.name.toLowerCase()
    // );
    // const player1PokemonSprite = await player1PokemonSpriteRequest
    //   .json()
    //   .then((pokemonData) => pokemonData.sprites.front_default);

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
