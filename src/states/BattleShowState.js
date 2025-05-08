class BattleShowState {
  constructor(player1BattleState, player2BattleState, omniBattleState) {
    this.player1BattleState = player1BattleState;
    this.player2BattleState = player2BattleState;
    this.omniBattleState = omniBattleState;
    this.startedTime = false;
    this.animating = true;
  }

  get stateName() {
    return battleStates.BATTLE_SHOW;
  }

  updatePlayersReady() {
    return !this.animating;
  }

  display() {
    const hud = document.getElementById("hud");
    const players = document.getElementById("players");

    const header = createElementWithText("h1", "Animating");

    hud.insertBefore(header, players);

    // TODO: not using time, have animations
    if (!this.startedTime) {
      this.startedTime = true;
      setTimeout(() => {
        this.animating = false;
      }, 3000);
    }
  }

  isStateDone() {}
}
