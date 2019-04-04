import openSocket from 'socket.io-client';
import { ENDPOINT } from '../config';
import LinkedList from '../utils/LinkedList';
const socket = openSocket(ENDPOINT);

const listenFoodEvents = (callback) => {
    socket.on('getFood', food => {
        callback(food);
    })
};

const listenEnemyPositionEvent = (callback) => {
    socket.on('enemyPosition', user => {
        const enemySnake = new LinkedList();
        let currentEnemySnakeNode = user.head;
        while (currentEnemySnakeNode) {
            enemySnake.addLast(currentEnemySnakeNode.data);
            currentEnemySnakeNode = currentEnemySnakeNode.next;
        }
        callback(enemySnake);
    });
}


export { listenFoodEvents, listenEnemyPositionEvent };