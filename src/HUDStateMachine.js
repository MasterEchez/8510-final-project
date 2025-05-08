class HUDStateMachine {
  constructor(state) {
    this.state = state;
    this.timer = 0;
  }

  display() {
    this.resetDisplay();
    this.state.display();
  }

  updateState(player1Gesture, player2Gesture) {
    //hard coded for now
    return this.state.updateState(player1Gesture, player2Gesture);
  }

  async stateTransition() {
    switch (this.state.stateName) {
      case battleStates.CONFIRM_USERS:
        // if (this.state.checkPlayersReady()) {
        // await this.endState();
        await fetch("http://localhost:3000/start", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({}),
        })
          .then((response) => {
            return response.json();
          })
          .then((responseData) => {
            console.log(responseData);
            this.state = new BattleShowState(
              responseData.p1,
              responseData.p2,
              responseData.omni
            );
          });
        // }
        break;
      case battleStates.BATTLE_WAITING:
        break;
      case battleStates.BATTLE_SHOW:
        const [player1BattleState, player2BattleState, omniBattleState] = [
          this.state.player1BattleState,
          this.state.player2BattleState,
          this.state.omniBattleState,
        ];
        this.state = new BattleWaitingState(
          player1BattleState,
          player2BattleState,
          omniBattleState
        );
        break;
      case battleStates.BATTLE_OVER:
        break;
    }
  }

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
