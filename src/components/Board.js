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
    background-color: ${props => boardColorSelector(props)};
    border: ${({ helpedMode }) => helpedMode ? '1px solid black' : '1px solid white'};
   
    @media (max-width: 1375px) {
      min-width: 16px;
      min-height: 16px;
    }
    @media (max-width: 950px) {
      min-width: 15px;
      min-height: 15px;
    }
    @media (max-width: 895px) {
      min-width: 13px;
      min-height: 13px;
    }
    @media (max-width: 798px) {
      min-width: 12px;
      min-height: 12px;
    }
    @media (max-width: 755px) {
      min-width: 10px;
      min-height: 10px;
    } 
    @media (max-width: 644px) {
      min-width: 9px;
      min-height: 9px;
    } 
    @media (max-width: 592px) {
      min-width: 8px;
      min-height: 8px;
    } 
    @media (max-width: 571px) {
      min-width: 7px;
      min-height: 7px;
    } 
    @media (max-width: 480px) {
      min-width: 6px;
      min-height: 6px;
    } 
    @media (max-width: 460px) {
      min-width: 5px;
      min-height: 5px;
    } 
`;

const boardColorSelector = ({ counter, snake, apple, snakeBodyElem, enemySnake, enemySnakeBodyElem }) => {
  const isSnakeHead = snake && snake[0] === counter;
  const isApple = apple && apple === counter;
  const isEnemySnakeHead = enemySnake && enemySnake[0] === counter;

  if (isSnakeHead) {
    return 'green';
  }
  if (snakeBodyElem) {
    return 'yellow';
  }
  if (isEnemySnakeHead) {
    return 'orange';
  }
  if (enemySnakeBodyElem) {
    return 'blue';
  }
  if (isApple) {
    return 'red';
  }
  return 'white';
}

const isCellOnSnakeBody = (counter, userSnake) => {
  let isSnakeContainCell = false;
  if (userSnake) {
    for (let i = 1; i < userSnake.length; i++) {
      if (userSnake[i] === counter) {
        isSnakeContainCell = true;
        break;
      }
    }
  }

  return isSnakeContainCell;
}

const renderTable = ({ snake, apple, helpedMode, enemySnake }) => {
  let rows = [];
  let counter = 0;
  let snakeBodyElem = false;
  let enemySnakeBodyElem = false;
  for (let i = 0; i < BOARD_HEIGHT; i++) {
    let cell = [];
    for (let j = 0; j < BOARD_WIDTH; j++) {
      let cellId = `cell ${i}-${j}`;
      snakeBodyElem = isCellOnSnakeBody(counter, snake);
      enemySnakeBodyElem = isCellOnSnakeBody(counter, enemySnake);
      cell.push(<StyledColumn
        helpedMode={helpedMode}
        key={cellId}
        counter={counter}
        apple={apple}
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

const Board = ({ snake, apple, helpedMode, enemySnake }) => (
  <Table>
    {renderTable({ snake, apple, helpedMode, enemySnake })}
  </Table>
);

export default Board;