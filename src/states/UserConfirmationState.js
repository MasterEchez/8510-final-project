export class UserConfirmationState {
  constructor() {
    this.player1Ready = false;
    this.player2Ready = false;
  }

  display() {
    const header = document.createElement("h1");
    const headerContent = document.createTextNode(
      "Both players make a thumbs up 👍 to start!"
    );
    const hud = document.getElementById("hud");

    header.appendChild(headerContent);
    hud.appendChild(header);
  }

  checkPlayersReady() {}

  updatePlayersReady() {}

  isStateDone() {}
}
