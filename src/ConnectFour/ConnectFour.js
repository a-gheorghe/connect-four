import React, { useEffect, useState } from "react";
import Cell from "../Cell";
import styles from './ConnectFour.module.css';

const ConnectFour = () => {
  const NUM_ROWS = 6;
  const NUM_COLUMNS = 7;
  const NUM_CONNECT = 4;
  const [grid, setGrid] = useState([]);
  const [turn, setTurn] = useState("1");
  const [gameOver, setGameOver] = useState({
    gameOver: false,
    direction: null,
    winner: null
  });

  const createTable = () => {
    const table = [];
    for (let i = 0; i < NUM_ROWS; i++) {
      const row = [];
      for (let j = 0; j < NUM_COLUMNS; j++) {
        row.push("0");
      }
      table.push(row);
    }
    setGrid(table);
  };

  const dropChip = colIndex => {
    for (let row = NUM_ROWS - 1; row >= 0; row--) {
      if (grid[row][colIndex] === "0") {
        const newGrid = [...grid];
        newGrid[row][colIndex] = turn;
        setGrid(newGrid);
        return;
      }
    }
    alert("no more space in this column");
  };

  const verticalWin = () => {
    let row = 0;
    let col = 0;
    let current = null;
    for (col = 0; col < NUM_COLUMNS; col++) {
      let occupiedBy;
      let count = 0;
      for (row = 0; row < NUM_ROWS; row++) {
        current = grid[row][col];
        if (current !== "0") {
          if (current === occupiedBy) {
            count++;
            if (count === NUM_CONNECT) {
              setGameOver({
                gameOver: true,
                direction: "vertical",
                winner: occupiedBy
              });
              return;
            }
          } else {
            occupiedBy = current;
            count = 1;
          }
        } else {
          occupiedBy = current;
          count = 0;
        }
      }
    }
  }

  const horizontalWin = () => {
    let row = 0;
    let col = 0;
    let current = null;
    for (row = 0; row < NUM_ROWS; row++) {
      let occupiedBy;
      let count = 0;
      for (col = 0; col < NUM_COLUMNS; col++) {
        current = grid[row][col];
        if (current !== "0") {
          if (occupiedBy === current) {
            count++;
            if (count === NUM_CONNECT) {
              setGameOver({
                gameOver: true,
                direction: "horizontal",
                winner: occupiedBy
              });
              return;
            }
          } else {
            occupiedBy = current;
            count = 1;
          }
        } else {
          occupiedBy = "0";
          count = 0;
        }
      }
    }
  }

  const diagonalUpWin = () => {
    let current = null;
    for (let row = 0; row < NUM_ROWS; row++) {
      for (let col = 0; col < NUM_COLUMNS; col++) {
        current = grid[row][col];
        if (current === turn) {
          if (
            row + NUM_CONNECT - 1 < NUM_ROWS &&
            col + NUM_CONNECT - 1 < NUM_COLUMNS
          ) {
            let win = true;
            for (let i = 1; i < NUM_CONNECT; i++) {
              if (grid[row + i][col + i] !== turn) {
                win = false;
                break;
              }
            }

            win &&
              setGameOver({
                gameOver: true,
                direction: "diagonal top left to bottom right",
                winner: turn
              });
            return;
          }
        }
      }
    }
  }

  const diagonalDownWin = () => {
    let current = null;
    for (let row = 0; row < NUM_ROWS; row++) {
      for (let col = 0; col < NUM_COLUMNS; col++) {
        current = grid[row][col];
        if (current === turn) {
          if (
            row + NUM_CONNECT - 1 < NUM_ROWS &&
            col - NUM_CONNECT - 1 < NUM_COLUMNS
          ) {
            let win = true;
            for (let i = 1; i < NUM_CONNECT; i++) {
              if (grid[row + i][col - i] !== turn) {
                win = false;
                break;
              }
            }

            win &&
              setGameOver({
                gameOver: true,
                direction: "diagonal top right to bottom left",
                winner: turn
              });
            return;
          }
        }
      }
    }
  };



  const checkResult = () => {
    if (grid.length) {
      verticalWin();
      horizontalWin();
      diagonalUpWin();
      diagonalDownWin();
    }
  }


  const playTurn = colIndex => {
    dropChip(colIndex);
  };

  const changeTurn = () => {
    turn === "1" ? setTurn("2") : setTurn("1");
  };

  const resetGame = () => {
    setGameOver(false);
    createTable();
  };

  useEffect(() => {
    createTable();
  }, []);

  useEffect(() => {
    checkResult();
  }, [grid]);

  useEffect(() => {
    if (!gameOver.gameOver) {
      changeTurn();
    }
  }, [grid]);

  return (
    <div className={styles.test}>
      <label> Number of rows </label>
      <input onChange={() => setNumberRows()}> </input>
      <table>
        <tbody>
          {grid.map((row, rowIndex) => (
            <tr className={styles.row} key={rowIndex}>
              {row.map((cell, colIndex) => (
                <Cell
                  rowIndex={rowIndex}
                  colIndex={colIndex}
                  key={colIndex}
                  val={grid[rowIndex][colIndex]}
                  onClick={
                    gameOver.gameOver ? () => {} : () => playTurn(colIndex)
                  }
                />
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {gameOver.gameOver && (
        <div>
          {" "}
          Game over! Player {gameOver.winner} wins {gameOver.direction}{" "}
          <button onClick={resetGame}> Reset game </button>
        </div>
      )}
    </div>
  );
};

export default ConnectFour;
