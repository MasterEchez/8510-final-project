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

  display() {}

  checkPlayerGestures() {}

  updatePlayerActions() {}

  isStateDone() {}
}
