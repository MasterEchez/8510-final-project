const battleStates = {
  CONFIRM_USERS: 0,
  BATTLE_WAITING: 1, // waiting for player moves
  BATTLE_SHOW: 2, // show results of turn
  BATTLE_OVER: 3,
};

const gestures = {
  THUMBS_UP: "Thumb_Up",
  THUMBS_DOWN: "Thumb_Down",
  VICTORY: "Victory",
  POINTING_UP: "Pointing_Up",
  CLOSED_FIST: "Closed_Fist",
  OPEN_PALM: "Open_Palm",
  LOVE: "ILoveYou",
};

function removeAllChildren(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

function createElementWithText(tag, text) {
  const element = document.createElement(tag);
  const content = document.createTextNode(text);

  element.appendChild(content);
  return element;
}
