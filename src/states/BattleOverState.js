class BattleOverState {
  constructor(playerThatWon) {
    this.playerThatWon = playerThatWon;
  }

  get stateName() {
    return battleStates.BATTLE_OVER;
  }

  display() {}

  isStateDone() {}
}
