export class BattleWaitingState {
  constructor(player1BattleState, player2BattleState) {
    this.player1BattleState = player1BattleState;
    this.player2BattleState = player2BattleState;
    this.player1Done = false;
    this.player2Done = false;
    this.player1Action;
    this.player2Action;
  }

  display() {}

  checkPlayerGestures() {}

  updatePlayerActions() {}

  isStateDone() {}
}
