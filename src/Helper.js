const battleStates = {
  CONFIRM_USERS: 0,
  BATTLE_WAITING: 1, // waiting for player moves
  BATTLE_SHOW: 2, // show results of turn
  BATTLE_OVER: 3,
};

const gestures = {
  THUMBS_UP: 0,
  THUMBS_DOWN: 1,
  VICTORY: 2,
  POINTING_UP: 3,
  CLOSED_FIST: 4,
  OPEN_PALM: 5,
  LOVE: 6,
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
