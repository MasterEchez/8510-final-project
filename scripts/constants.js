export const battleStates = {
    CONFIRM_USERS: 'confirm_users',
    BATTLE_WAITING: 'battle_waiting', // waiting for player moves
    BATTLE_SHOW: 'battle_show', // show results of turn
    BATTLE_OVER: 'battle_over',
}

export const gestures = {
    THUMBS_UP: 'thumbs_up',
    THUMBS_DOWN: 'thumbs_down',
    VICTORY: 'victory',
    POINTING_UP: 'point_up',
    CLOSED_FIST: 'closed_fist',
    OPEN_PALM: 'open_palm',
    LOVE: 'love'
}

export const gestureToChoice = (gesture) => {
    switch (gesture) {
        case gestures.THUMBS_UP:
            return 'move 1';
        case gestures.THUMBS_DOWN:
            return 'move 2';
        case gestures.VICTORY:
            return 'move 3';
        case gestures.POINTING_UP:
            return 'move 4';
    }
}