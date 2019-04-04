export const BOARD_WIDTH = 50;
export const BOARD_HEIGHT = 24;
export const DIRECTION = {
    LEFT: -1,
    RIGHT: 1,
    UP: -BOARD_WIDTH,
    DOWN: BOARD_WIDTH,
};
export const INITIAL_SPEED = 100;
export const MAX_SPEED = 20;
export const MAX_CELLS = BOARD_HEIGHT * BOARD_WIDTH;
export const INITIAL_SNAKE_LEN = 4;
export const ENDPOINT = 'http://localhost:3000/';
export const RIGHT_KEY_CODE = 39;
export const LEFT_KEY_CODE = 37;
export const UP_KEY_CODE = 38;
export const DOWN_KEY_CODE = 40;