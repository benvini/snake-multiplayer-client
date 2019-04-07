const { TOTAL_BOARD_CELLS, BOARD_WIDTH, BOARD_HEIGHT, INITIAL_SNAKE_LEN } = require('../config');

const Helpers = {
    createApple: () => {
        const apple = Math.ceil(Math.random() * TOTAL_BOARD_CELLS - 1);

        return apple;
    },

    createSnake: () => {
        let snake = [];
        const randomSnakePosition = Math.floor(
            Math.random() * BOARD_WIDTH * BOARD_HEIGHT - 1
        );

        for (let i = 0; i < INITIAL_SNAKE_LEN; i++) {
            snake.push(randomSnakePosition - i);
        }

        return snake;
    },
}

export default Helpers;