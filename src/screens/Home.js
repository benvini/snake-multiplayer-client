import React, { Component } from "react";
import styled from "styled-components";
import Board from "../components/Board";
import socketIOClient from "socket.io-client";
import LinkedList from "../utils/LinkedList";
import { listenFoodEvents, listenEnemyPositionEvent } from "../api";
import {
  BOARD_WIDTH,
  BOARD_HEIGHT,
  DIRECTION,
  INITIAL_SPEED,
  MAX_SPEED,
  DOWN_KEY_CODE,
  UP_KEY_CODE,
  LEFT_KEY_CODE,
  MAX_CELLS,
  INITIAL_SNAKE_LEN,
  ENDPOINT,
  RIGHT_KEY_CODE
} from "../config";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
`;

const Score = styled.label`
  font-size: 12px;
`;

const Button = styled.button`
  display: flex;
  margin-bottom: 4px;
`;

const Title = styled.h1`
  display: flex;
`;

const socket = socketIOClient(ENDPOINT);

class Home extends Component {
  state = {
    helpedMode: false,
    helpBtnText: "Help",
    snake: null,
    enemySnake: null,
    food: null,
    speed: INITIAL_SPEED,
    lastDirection: 0
  };

  componentDidMount() {
    const initialSnake = new LinkedList();
    const randomSnakePosition = Math.floor(
      Math.random() * BOARD_WIDTH * BOARD_HEIGHT - 1
    );
    for (let i = 0; i < INITIAL_SNAKE_LEN; i++) {
      initialSnake.addLast(randomSnakePosition - i);
    }
    this.setState({ snake: initialSnake });

    listenFoodEvents(food => {
      this.setState({ food });
    });

    listenEnemyPositionEvent(enemySnake => {
      this.setState({ enemySnake });
    });
  }

  componentWillUnmount() {
    clearInterval(this.loopMovement);
  }

  helpBtnClickedHandler = () => {
    let { helpBtnText } = this.state;
    if (helpBtnText === "Help") {
      helpBtnText = "Disable Help";
    } else {
      helpBtnText = "Help";
    }

    this.setState({ helpedMode: !this.state.helpedMode, helpBtnText });
  };

  movement = currentDirection => {
    if (currentDirection + this.state.lastDirection === 0) {
      return;
    }

    let { speed } = this.state;
    const { snake } = this.state;
    clearInterval(this.loopMovement);
    this.loopMovement = setInterval(() => {
      let addCellToSnakeHead = (snake.head.data += currentDirection);
      if (addCellToSnakeHead % BOARD_WIDTH === 0 && currentDirection === 1) {
        addCellToSnakeHead -= BOARD_WIDTH;
      } else if (
        (addCellToSnakeHead + 1) % BOARD_WIDTH === 0 &&
        currentDirection === -1
      ) {
        addCellToSnakeHead += BOARD_WIDTH;
      } else if (addCellToSnakeHead < 0) {
        addCellToSnakeHead += MAX_CELLS;
      } else if (addCellToSnakeHead > MAX_CELLS) {
        addCellToSnakeHead -= MAX_CELLS;
      }
      snake.addFirst(addCellToSnakeHead);
      if (addCellToSnakeHead !== this.state.food) {
        snake.removeLast();
      } else {
        if (speed > MAX_SPEED) {
          speed -= 10;
        }
        socket.emit("foodEaten");
      }

      this.setState({
        snake,
        speed,
        lastDirection: currentDirection
      });

      socket.emit("myPosition", {
        id: socket.id,
        head: snake.head
      });
    }, this.state.speed);
  };

  onKeyPressed = event => {
    switch (event.keyCode) {
      case LEFT_KEY_CODE: //left
        this.movement(DIRECTION.LEFT);
        break;
      case UP_KEY_CODE: //up
        this.movement(DIRECTION.UP); // -table_width
        break;
      case RIGHT_KEY_CODE: //right
        this.movement(DIRECTION.RIGHT);
        break;
      case DOWN_KEY_CODE: //down
        this.movement(DIRECTION.DOWN); // +table_width
        break;
      case 80: //p
        if (this.loopMovement) {
          clearInterval(this.loopMovement);
          this.loopMovement = false;
        } else {
          this.movement(this.state.lastDirection);
        }
        break;
      default:
        break;
    }
  };
  render() {
    const score =
      (this.state.snake && this.state.snake.count - INITIAL_SNAKE_LEN) || 0;
    return (
      <Container onKeyDown={this.onKeyPressed} tabIndex="0">
        <Title>Welcome To The Snake Game!</Title>
        <Button onClick={this.helpBtnClickedHandler}>
          {this.state.helpBtnText}
        </Button>
        <Score>Score: {score}</Score>
        <Board
          helpedMode={this.state.helpedMode}
          snake={this.state.snake}
          enemySnake={this.state.enemySnake}
          food={this.state.food}
        />
      </Container>
    );
  }
}

export default Home;
