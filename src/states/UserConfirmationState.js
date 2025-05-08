class UserConfirmationState {
  constructor() {
    this.player1Ready = false;
    this.player2Ready = false;
    // this.isStateOver;
    this.player1Gesture = "";
    this.player2Gesture = "";
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
      const checkMark = createElementWithText("span", "✅");
      player1.appendChild(checkMark);
    }

    if (this.player2Ready) {
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
      this.player1Ready = this.player1Gesture === gestures.THUMBS_UP;
    }

    if (!this.player2Ready) {
      this.player2Ready = this.player2Gesture === gestures.THUMBS_UP;
    }

    // console.log(this.player1Gesture);
  }

  // update players ready
  updateState(player1Gesture) {
    this.player1Gesture = player1Gesture;
    this.updatePlayerReadiness();
    // return this.player1Ready && this.player2Ready;
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
