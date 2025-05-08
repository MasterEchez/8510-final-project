class BattleWaitingState {
  constructor(player1BattleState, player2BattleState, omniBattleState) {
    this.player1BattleState = player1BattleState;
    this.player2BattleState = player2BattleState;
    this.omniBattleState = omniBattleState;
    this.player1Done = false;
    this.player2Done = false;
    this.player1Action;
    this.player2Action;
  }

  get stateName() {
    return battleStates.BATTLE_WAITING;
  }

  updatePlayersReady() {
    return this.player1Done && this.player2Done;
  }

  display() {
    const hud = document.getElementById("hud");
    const players = document.getElementById("players");

    const header = createElementWithText("h1", "Make gesture for move/switch");

    hud.insertBefore(header, players);

    // get gesture
    const p1_gesture = createElementWithText("span", "p1_gest");
    player1.appendChild(p1_gesture);

    // get gesture
    const p2_gesture = createElementWithText("span", "p2_gest");
    player2.appendChild(p2_gesture);
  }

  checkPlayerGestures() {}

  updatePlayerActions() {}

  isStateDone() {}
}
