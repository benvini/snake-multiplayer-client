import openSocket from 'socket.io-client';
import { ENDPOINT } from '../config';
const socket = openSocket(ENDPOINT);

const listenAppleEvents = (callback) => {
    socket.on('newApple', apple => {
        callback(apple);
    })
};

const listenEnemyDeadEvents = (callback) => {
    socket.on('enemyDead', user => {
        callback(user.snake);
    })
};

export { listenAppleEvents, listenEnemyDeadEvents };