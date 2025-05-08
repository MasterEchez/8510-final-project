const battleStates = {
  CONFIRM_USERS: 0,
  BATTLE_WAITING: 1, // waiting for player moves
  BATTLE_SHOW: 2, // show results of turn
  BATTLE_OVER: 3,
};

const gestures = {
  THUMBS_UP: "thumbs_up",
  THUMBS_DOWN: "thumbs_down",
  VICTORY: "victory",
  POINTING_UP: "point_up",
  CLOSED_FIST: "closed_fist",
  OPEN_PALM: "open_palm",
  LOVE: "love",
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
