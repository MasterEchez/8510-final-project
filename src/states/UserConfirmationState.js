class UserConfirmationState {
  constructor() {
    this.player1Ready = false;
    this.player2Ready = false;
    // this.isStateOver;
    this.player1Gestures = [];
    this.player2Gestures = [];
    this.timer = 0;
  }

  // get function
  get stateName() {
    return battleStates.CONFIRM_USERS;
  }

  // display function
  display() {
    const hud = document.getElementById("hud");
    const players = document.getElementById("players");

    const header = createElementWithText(
      "h1",
      "Both players make a thumbs up 👍 to start!"
    );

    hud.insertBefore(header, players);

    // Checks marks to show feedback to the user
    if (this.player1Ready) {
      const player1 = document.getElementById("player1");
      const checkMark = createElementWithText("span", "✅");
      player1.appendChild(checkMark);
    }

    if (this.player2Ready) {
      const player2 = document.getElementById("player2");
      const checkMark = createElementWithText("span", "✅");
      player2.appendChild(checkMark);
    }
  }

  // check players ready
  checkPlayersReady() {
    return this.player1Ready && this.player2Ready;
  }

  updatePlayerReadiness() {
    // poll for gesture
    if (!this.player1Ready) {
      this.player1Ready = this.player1Gestures.includes(gestures.THUMBS_UP);
    }

    if (!this.player2Ready) {
      this.player2Ready = this.player2Gestures.includes(gestures.THUMBS_UP);
    }
  }

  // update players ready
  updateState(player1Gestures, player2Gestures) {
    this.player1Gestures = player1Gestures.slice();
    this.player2Gestures = player2Gestures.slice();
    this.updatePlayerReadiness();
    if (this.checkPlayersReady() && this.timer !== 0) {
      this.timer = Date.now();
    }
  }

  isOver() {
    return this.checkPlayersReady() && Date.now() - this.timer > 3000;
  }

  // async
  // endState() {
  //   this.isStateOver = new Promise((resolve, reject) => {
  //     setTimeout(() => {
  //       resolve("Ready for battle!");
  //     }, 5000);
  //   });
  // }

  // startTransitionTimer() {
  //   this.startTime = Date.now();
  // }

  // isTransitionTimerOver() {
  //   return Date.now() - this.startTime > 5000; // 5 secs
  // }

  // State machine flag
  // get isStateOver() {
  //   return this.isStateOver;
  // }
}
