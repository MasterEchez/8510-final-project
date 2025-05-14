class BattleShowState {
  constructor(player1BattleState, player2BattleState, omniBattleState) {
    this.player1BattleState = player1BattleState;
    this.player2BattleState = player2BattleState;
    this.omniBattleState = omniBattleState;
    this.startedTime = false;
    this.animating = true;
    this.p1Parsed = parsePlayerState(this.player1BattleState);
    this.p2Parsed = parsePlayerState(this.player2BattleState);
    this.animationList = parseOmniState(this.omniBattleState);

    console.log(this.animationList);
  }

  get stateName() {
    return battleStates.BATTLE_SHOW;
  }

  updateState(player1Gestures, player2Gestures) {
    return;
  }

  updatePlayersReady() {
    return !this.animating;
  }

  display() {
    const player1 = document.getElementById("player1");
    const player2 = document.getElementById("player2");

    // const header = createElementWithText("h1", "Animating");

    // hud.insertBefore(header, players);
    let player1PokemonName;
    // let player1PokemonHP;
    // let player1PokemonSprite;
    let player2PokemonName;
    // let player2PokemonHP;
    // let player2PokemonSprite;

    // const player1PokemonSprite = document.createElement("img");
    // const player2PokemonSprite = document.createElement("img");

    for (const obj of this.animationList) {
      const pokemonName = obj.pokemon;
      // const pokemonSpriteRequest = await fetch(
      //   "https://pokeapi.co/api/v2/pokemon/" + pokemonName.toLowerCase()
      // );
      // const pokemonSprite = pokemonSpriteRequest.sprites.front_default;

      if (obj.player === "p1") {
        player1PokemonName = createElementWithText("h2", pokemonName);
        // player1PokemonSprite.setAttribute("src", pokemonSprite);
      } else if (obj.player === "p2") {
        player2PokemonName = createElementWithText("h2", pokemonName);
        // player2PokemonSprite.setAttribute("src", pokemonSprite);
      }
    }

    player1.appendChild(player1PokemonName);
    // player1.appendChild(player1PokemonSprite);
    player2.appendChild(player2PokemonName);
    // player2.appendChild(player2PokemonSprite);

    console.log(this.animationList);
    console.log(this.p1Parsed);
    console.log(this.p2Parsed);

    // TODO: not using time, have animations
    // if (!this.startedTime) {
    //   this.startedTime = true;
    //   setTimeout(() => {
    //     this.animating = false;
    //   }, 3000);
    // }
  }

  isStateDone() {}
}
