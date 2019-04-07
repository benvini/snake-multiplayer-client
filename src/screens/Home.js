import React, { Component } from "react";
import styled from "styled-components";
import Board from "../components/Board";
import socketIOClient from "socket.io-client";
import Helpers from "../utils/helpers";
import { listenAppleEvents, listenEnemyDeadEvents } from "../api";
import {
  BOARD_WIDTH,
  TOTAL_BOARD_CELLS,
  DIRECTION,
  INITIAL_SPEED,
  MAX_SPEED,
  INITIAL_SNAKE_LEN,
  ENDPOINT,
  RIGHT_ARROW_KEY_CODE,
  UP_ARROW_KEY_CODE,
  LEFT_ARROW_KEY_CODE,
  DOWN_ARROW_KEY_CODE,
  P_KEY_CODE
} from "../config";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
`;

const Score = styled.label`
  font-size: 14px;
  font-weight: bold;
  margin-right: 12px;
  margin-bottom: 8px;
  @media (max-width: 644px) {
    font-size: 11px;
  }
  @media (max-width: 571px) {
    font-size: 10px;
  }
  @media (max-width: 480px) {
    font-size: 9px;
  }
`;

const StyledScore = styled.div`
  display: flex;
`;

const Button = styled.button`
  margin-bottom: 12px;
  position: relative;
  outline: none;
  background-color: #f39c12;
  border: none;
  border-radius: 16px;
  padding: 12px;
  width: 100px;
  cursor: pointer;
  text-align: center;
  transition-duration: 0.4s;
  text-decoration: none;
  overflow: hidden;
  display: block;
  :hover {
    background: #fff;
    box-shadow: 0px 2px 10px 5px #97b1bf;
    color: #000;
  }
  :after {
    content: "";
    background: #f1c40f;
    display: block;
    position: absolute;
    padding-top: 300%;
    padding-left: 350%;
    margin-left: -20px !important;
    margin-top: -120%;
    opacity: 0;
    transition: all 0.8s;
  }
  :active:after {
    padding: 0;
    margin: 0;
    opacity: 1;
    transition: 0s;
  }

  @media (max-width: 644px) {
    font-size: 12px;
    width: 95px;
  }
  @media (max-width: 609px) {
    font-size: 10px;
    width: 85px;
  }
  @media (max-width: 571px) {
    font-size: 9px;
    width: 82px;
  }
  @media (max-width: 480px) {
    font-size: 8px;
    width: 80px;
  }
`;

const Title = styled.h1`
  display: flex;

  @media only screen and (max-width: 962px) {
    font-size: 28px;
  }
  @media only screen and (max-width: 740px) {
    font-size: 20px;
  }
  @media only screen and (max-width: 550px) {
    font-size: 16px;
  }
  @media only screen and (max-width: 430px) {
    font-size: 9px;
  }
`;

const socket = socketIOClient(ENDPOINT);

class Home extends Component {
  state = {
    helpedMode: false,
    helpBtnText: "Help",
    snake: [],
    enemySnake: [],
    apple: null,
    speed: INITIAL_SPEED,
    lastDirection: 0
  };

  componentDidMount() {
    this.div.focus();

    listenAppleEvents(apple => {
      this.setState({ apple });
    });

    listenEnemyDeadEvents(enemySnake => {
      this.restartGame(enemySnake);
      this.setState({ enemySnake });
    });

    const initialSnake = Helpers.createSnake();
    this.setState({ snake: initialSnake });

    socket.on("newSnake", snake => {
      this.setState({ snake });
    });

    socket.on("enemyPosition", user => {
      this.setState({ enemySnake: user.snake });
    });
  }

  componentWillUnmount() {
    clearInterval(this.loopMovement);
  }

  helpBtnClickHandler = () => {
    let { helpBtnText } = this.state;
    if (helpBtnText === "Help") {
      helpBtnText = "Disable Help";
    } else {
      helpBtnText = "Help";
    }

    this.setState({ helpedMode: !this.state.helpedMode, helpBtnText });
  };

  isHeadHitSnake = (head, snake) => {
    let isHitSnake = false;
    for (let i = 1; i < snake.length; i++) {
      if (head === snake[i]) {
        isHitSnake = true;
        break;
      }
    }

    return isHitSnake;
  };

  movement = currentDirection => {
    let { speed } = this.state;
    const { snake, enemySnake } = this.state;

    if (currentDirection + this.state.lastDirection === 0) {
      return;
    }
    clearInterval(this.loopMovement);
    this.loopMovement = setInterval(() => {
      const currentSnakeTail = snake[snake.length - 1];
      for (let i = snake.length - 1; i > 0; i--) {
        snake[i] = snake[i - 1];
      }

      let addCellToSnakeHead = snake[0] + currentDirection;
      if (addCellToSnakeHead % BOARD_WIDTH === 0 && currentDirection === 1) {
        addCellToSnakeHead -= BOARD_WIDTH;
      } else if ((addCellToSnakeHead + 1) % BOARD_WIDTH === 0 &&
        currentDirection === -1) {
        addCellToSnakeHead += BOARD_WIDTH;
      } else if (addCellToSnakeHead < 0) {
        addCellToSnakeHead += TOTAL_BOARD_CELLS;
      } else if (addCellToSnakeHead > TOTAL_BOARD_CELLS) {
        addCellToSnakeHead -= TOTAL_BOARD_CELLS;
      }

      snake[0] = addCellToSnakeHead;
      if (addCellToSnakeHead === this.state.apple) {
        snake.push(currentSnakeTail);
        if (speed > MAX_SPEED) {
          speed -= 10;
        }
        socket.emit("getApple");
      }

      if (snake[0] === enemySnake[0] ||
        this.isHeadHitSnake(snake[0], enemySnake) ||
        this.isHeadHitSnake(snake[0], snake)) {
        clearInterval(this.loopMovement);
        socket.emit("dead", {
          id: socket.id,
          snake
        });
      }

      socket.emit("myPosition", {
        id: socket.id,
        snake
      });

      this.setState({
        snake,
        speed,
        lastDirection: currentDirection
      });
    }, this.state.speed);
  };

  restartGame = enemySnake => {
    socket.emit("getApple");
    socket.emit("getSnake");
    this.setState({
      enemySnake,
      speed: INITIAL_SPEED,
      helpedMode: false,
      lastDirection: 0,
      helpBtnText: "Help"
    });
  };

  onKeyPressed = event => {
    switch (event.keyCode) {
      case LEFT_ARROW_KEY_CODE:
        this.movement(DIRECTION.LEFT);
        break;
      case UP_ARROW_KEY_CODE:
        this.movement(DIRECTION.UP);
        break;
      case RIGHT_ARROW_KEY_CODE:
        this.movement(DIRECTION.RIGHT);
        break;
      case DOWN_ARROW_KEY_CODE:
        this.movement(DIRECTION.DOWN);
        break;
      case P_KEY_CODE:
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

  calcScore = snake => {
    let score = (snake && snake.length - INITIAL_SNAKE_LEN) || 0;
    if (score < 0) {
      score = 0;
    }

    return score;
  };

  render() {
    let score = this.calcScore(this.state.snake);
    let enemyScore = this.calcScore(this.state.enemySnake);
    return (
      <Container
        tabIndex="0"
        onKeyDown={this.onKeyPressed}
        ref={c => { this.div = c; }} >
        <Title>Welcome To The Snake Game!</Title>
        <Button onClick={this.helpBtnClickHandler}>
          {this.state.helpBtnText}
        </Button>
        <StyledScore>
          <Score>Your Score: {score}</Score>
          <Score>Opponent Score: {enemyScore}</Score>
        </StyledScore>
        <Board
          helpedMode={this.state.helpedMode}
          snake={this.state.snake}
          enemySnake={this.state.enemySnake}
          apple={this.state.apple} />
      </Container>
    );
  }
}

export default Home;
