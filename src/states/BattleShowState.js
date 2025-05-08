class BattleShowState {
  constructor(player1BattleState, player2BattleState, omniBattleState) {
    this.player1BattleState = player1BattleState;
    this.player2BattleState = player2BattleState;
    this.omniBattleState = omniBattleState;
  }

  get stateName() {
    return battleStates.BATTLE_SHOW;
  }

  display() {
    const hud = document.getElementById("hud");
    const players = document.getElementById("players");

    const header = createElementWithText(
      "h1",
      "Turn"
    );

    hud.insertBefore(header, players);
  }

  isStateDone() {}
}
