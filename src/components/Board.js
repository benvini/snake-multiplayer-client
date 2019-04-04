import React from "react";
import styled from "styled-components";

import { BOARD_HEIGHT, BOARD_WIDTH } from '../config';

const Table = styled.div`
  border: 1px solid blue;
`;

const StyledRow = styled.div`
  display: flex;
`;

const StyledColumn = styled.div`
    display: flex;
    flex-direction: column;
    min-width: 16px;
    min-height: 16px;
    background-color: ${props => boardColorSelector(props)};
    border: ${({ helpedMode }) => helpedMode ? '1px solid black' : '1px solid white'};
`;

const boardColorSelector = ({ counter, snake, food, snakeBodyElem, enemySnake, enemySnakeBodyElem }) => {
  const isSnakeHead = snake && snake.head.data === counter;
  const isSnakeBody = snakeBodyElem;
  const isFood = food && food === counter;
  const isEnemySnakeHead = enemySnake && enemySnake.head.data === counter;
  const isEnemySnakeBody = enemySnakeBodyElem;

  if (isSnakeHead) {
    return 'green';
  }
  if (isSnakeBody) {
    return 'yellow';
  }
  if (isEnemySnakeHead) {
    return 'orange';
  }
  if (isEnemySnakeBody) {
    return 'blue';
  }
  if (isFood) {
    return 'red';
  }
  return 'white';
}

const isCellOnSnakeBody = ({ counter, snake }) => {
  let isSnakeContainCell = false;
  if (snake) {
    let currentSnakeNode = snake.head;
    currentSnakeNode = currentSnakeNode.next;
    while (currentSnakeNode) {
      if (counter === currentSnakeNode.data) {
        isSnakeContainCell = true;
      }
      currentSnakeNode = currentSnakeNode.next;
    }
  }
  return isSnakeContainCell;
}

const renderTable = ({ snake, food, helpedMode, enemySnake }) => {
  let rows = [];
  let counter = 0;
  let snakeBodyElem = false;
  let enemySnakeBodyElem = false;
  for (let i = 0; i < BOARD_HEIGHT; i++) {
    let cell = [];
    for (let j = 0; j < BOARD_WIDTH; j++) {
      let cellId = `cell ${i}-${j}`;
      snakeBodyElem = isCellOnSnakeBody({ counter, snake });
      enemySnakeBodyElem = isCellOnSnakeBody({ counter, enemySnake });
      cell.push(<StyledColumn
        helpedMode={helpedMode}
        key={cellId}
        counter={counter}
        food={food}
        snake={snake}
        enemySnake={enemySnake}
        enemySnakeBodyElem={enemySnakeBodyElem}
        snakeBodyElem={snakeBodyElem}
      />);
      counter++;
    }
    rows.push(<StyledRow key={i}>{cell}</StyledRow>);
  }
  return rows;
}

const Board = ({ snake, food, helpedMode, enemySnake }) => (
  <Table>
    {renderTable({ snake, food, helpedMode, enemySnake })}
  </Table>
);

export default Board;