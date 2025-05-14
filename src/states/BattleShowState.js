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

  async display() {
    const player1 = document.getElementById("player1");
    const player2 = document.getElementById("player2");

    const topHUDPlayer1 = document.createElement("div");
    const bottomHUDPlayer1 = document.createElement("div");
    topHUDPlayer1.setAttribute("class", "top-battle-hud");
    bottomHUDPlayer1.setAttribute("class", "bottom-battle-hud");

    const topHUDPlayer2 = document.createElement("div");
    const bottomHUDPlayer2 = document.createElement("div");
    topHUDPlayer2.setAttribute("class", "top-battle-hud");
    bottomHUDPlayer2.setAttribute("class", "bottom-battle-hud");

    let player1PokemonName;
    let player1PokemonHP;
    let player2PokemonName;
    let player2PokemonHP;

    const player1PokemonSprite = document.createElement("img");
    const player2PokemonSprite = document.createElement("img");
    player1PokemonSprite.setAttribute("id", "p1-pokemon-sprite");

    for (const obj of this.animationList) {
      const pokemonName = obj.pokemon;
      const pokemonSpriteRequest = await fetch(
        "https://pokeapi.co/api/v2/pokemon/" + pokemonName.toLowerCase()
      );
      // console.log(pokemonSpriteRequest.json.);
      const pokemonSprite = await pokemonSpriteRequest
        .json()
        .then((pokemonData) => pokemonData.sprites.front_default);

      if (obj.player === "p1") {
        const pokemonInfo = this.p1Parsed.party.find(
          (pokemon) => pokemon.name === pokemonName
        );
        const pokemonHP = pokemonInfo.condition;

        player1PokemonName = createElementWithText("h2", pokemonName);
        player1PokemonHP = createElementWithText("div", pokemonHP);
        player1PokemonSprite.setAttribute("src", pokemonSprite);
        player1PokemonSprite.setAttribute("class", "sprite");
      } else if (obj.player === "p2") {
        const pokemonInfo = this.p2Parsed.party.find(
          (pokemon) => pokemon.name === pokemonName
        );
        const pokemonHP = pokemonInfo.condition;
        player2PokemonName = createElementWithText("h2", pokemonName);
        player2PokemonHP = createElementWithText("div", pokemonHP);
        player2PokemonSprite.setAttribute("src", pokemonSprite);
        player2PokemonSprite.setAttribute("class", "sprite");
      }
    }

    topHUDPlayer1.appendChild(player1PokemonName);
    topHUDPlayer1.appendChild(player1PokemonHP);
    bottomHUDPlayer1.appendChild(player1PokemonSprite);
    topHUDPlayer2.appendChild(player2PokemonName);
    topHUDPlayer2.appendChild(player2PokemonHP);
    bottomHUDPlayer2.appendChild(player2PokemonSprite);

    player1.appendChild(topHUDPlayer1);
    player1.appendChild(bottomHUDPlayer1);
    player1.style.justifyContent = "space-between";
    // player1.appendChild(player1PokemonSprite);
    player2.appendChild(topHUDPlayer2);
    player2.appendChild(bottomHUDPlayer2);
    player2.style.justifyContent = "space-between";
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

  isOver() {
    return true;
  }
}
