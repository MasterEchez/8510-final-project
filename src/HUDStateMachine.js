class HUDStateMachine {
  constructor(state) {
    this.state = state;
    this.timer = 0;
  }

  display() {
    this.resetDisplay();
    this.state.display();
  }

  updateState() {
    //hard coded for now
    this.state.updatePlayersReady();
  }

  // stateTransition() {
  //   switch (this.state.stateName) {
  //     case battleStates.CONFIRM_USERS:
  //       if (this.state.checkPlayersReady()) {
  //         await this.endState();
  //         this.state = new BattleWaitingState();
  //       }
  //       break;
  //     case battleStates.BATTLE_WAITING:
  //       break;
  //     case battleStates.BATTLE_SHOW:
  //       break;
  //     case battleStates.BATTLE_OVER:
  //       break;
  //   }
  // }

  // Private
  resetDisplay() {
    const hud = document.getElementById("hud");
    const players = document.createElement("div");
    const player1 = document.createElement("div");
    const player2 = document.createElement("div");

    players.setAttribute("id", "players");
    player1.setAttribute("id", "player1");
    player2.setAttribute("id", "player2");

    removeAllChildren(hud);

    players.appendChild(player1);
    players.appendChild(player2);
    hud.appendChild(players);
  }
}
