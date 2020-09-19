export default class Board {
  constructor() {
    (this.cells = [
      ["", "", "", "", "", "", ""],
      ["", "", "", "", "", "", ""],
      ["", "", "", "", "", "", ""],
      ["", "", "", "", "", "", ""],
      ["", "", "", "", "", "", ""],
      ["", "", "", "", "", "", ""],
    ]),
      (this.rows = 6),
      (this.cols = 7),
      (this.heuristicVal = { red: -1000, yellow: 1000, tie: 0 });
  }

  getRowOfCol(col) {
    for (let row = this.rows - 1; row >= 0; row--) {
      if (this.cells[row][col] === "") {
        return row;
      }
    }
    return null;
  }

  getAllPossibleMoves() {
    let allMoves = [];
    for (let col = 0; col < this.cols; col++) {
      let row = this.getRowOfCol(col);
      if (row === null) {
        continue;
      }
      allMoves.push([row, col]);
    }
    return allMoves.reverse();
  }

  randomMove() {
    let allMoves = this.getAllPossibleMoves();
    let index = Math.floor(Math.random() * allMoves.length);
    let move = {};
    [move.i, move.j] = allMoves[index];
    this.cells[move.i][move.j] = "yellow";
  }

  doMove(pos, val) {
    this.cells[pos[0]][pos[1]] = val;
  }

  reverseMove(pos) {
    this.cells[pos[0]][pos[1]] = "";
  }

  bestMove() {
    let move = this.alphabeta(
      4,
      true,
      -Math.pow(10, 1000),
      Math.pow(10, 1000)
    )[1];
    if (move === null) {
      return;
    }
    this.cells[move.i][move.j] = "yellow";
  }

  getArrayOccurenceOfPiece(arr, piece) {
    let count = 0;
    for (let value of arr) {
      if (value === piece) {
        count++;
      }
    }
    return count;
  }

  getDynamicValOfArr(arr, AI) {
    const DICT = { red: "yellow", yellow: "red" };
    let PLAYER = DICT[AI];
    const AICount = this.getArrayOccurenceOfPiece(arr, AI);
    const OppntCount = this.getArrayOccurenceOfPiece(arr, PLAYER);
    const EmptyCount = this.getArrayOccurenceOfPiece(arr, "");
    let score = 0;

    if (OppntCount === 4) {
      score -= 10;
    } else if (OppntCount === 3) {
      score -= 5;
    } else if (OppntCount === 2) {
      score -= 2;
    }
    // THIS IS CHECKING THE AI COUNT AND VAL
    if (AICount === 4) {
      score += 10;
    } else if (AICount === 3 && EmptyCount === 1) {
      score += 5;
    } else if (AICount === 2 && EmptyCount === 2) {
      score += 2;
    }

    return score;
  }

  getScoreOfDynamicArr(piece, arr) {
    for (const elt of arr) {
      if (elt === undefined || elt === null) {
        return 0;
      }
    }
    return this.getDynamicValOfArr(arr, piece);
  }

  getDynamicScoreOfBoard(AI) {
    let score = 0;
    // HORIZONTAL CHECKING
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        if (col === 4) {
          break;
        }
        score += this.getScoreOfDynamicArr(AI, [
          this.cells[row][col],
          this.cells[row][col + 1],
          this.cells[row][col + 2],
          this.cells[row][col + 3],
        ]);
      }
    }
    // VERTICAL CHECKING
    for (let row = 0; row < this.rows; row++) {
      if (row === 3) {
        break;
      }
      for (let col = 0; col < this.cols; col++) {
        score += this.getScoreOfDynamicArr(AI, [
          this.cells[row][col],
          this.cells[row + 1][col],
          this.cells[row + 2][col],
          this.cells[row + 3][col],
        ]);
      }
    }
    // DIAGONAL CHECKING (NEGATIVE RISE OVER RUN)
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        try {
          score += this.getScoreOfDynamicArr(AI, [
            this.cells[row][col],
            this.cells[row + 1][col + 1],
            this.cells[row + 2][col + 2],
            this.cells[row + 3][col + 3],
          ]);
        } catch (error) {}
      }
    }
    // DIAGONAL CHECKING (POSITIVE RISE OVER RUN)
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        try {
          score += this.getScoreOfDynamicArr(AI, [
            this.cells[row][col],
            this.cells[row - 1][col + 1],
            this.cells[row - 2][col + 2],
            this.cells[row - 3][col + 3],
          ]);
        } catch (error) {}
      }
    }

    return score;
  }

  alphabeta(depth, maximizingPlayer, alpha, beta) {
    let state = this.stateOfBoard();
    if (depth === 0 || state !== null) {
      if (state !== null) {
        return [this.heuristicVal[state], null];
      } else {
        return [this.getDynamicScoreOfBoard("yellow"), null];
      }
    }

    if (maximizingPlayer) {
      let value = -Math.pow(10, 1000);
      let bestMove = { i: null, j: null };
      for (let move of this.getAllPossibleMoves()) {
        this.doMove(move, "yellow");
        let recursiveVal = this.alphabeta(depth - 1, false, alpha, beta)[0];
        this.reverseMove(move);

        if (recursiveVal > value) {
          value = recursiveVal;
          [bestMove.i, bestMove.j] = move;
        }
        alpha = Math.max(alpha, value);
        if (alpha >= beta) {
          break;
        }
      }
      return [value, bestMove];
    } else {
      let value = Math.pow(10, 1000);
      let bestMove = { i: null, j: null };
      for (let move of this.getAllPossibleMoves()) {
        this.doMove(move, "red");
        let recursiveVal = this.alphabeta(depth - 1, true, alpha, beta)[0];
        this.reverseMove(move);

        if (recursiveVal < value) {
          value = recursiveVal;
          [bestMove.i, bestMove.j] = move;
        }
        beta = Math.min(beta, value);
        if (beta <= alpha) {
          break;
        }
      }
      return [value, bestMove];
    }
  }

  fullBoard() {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        if (this.cells[i][j] === "") {
          return false;
        }
      }
    }
    return true;
  }

  stateOfBoard() {
    let state = this.getWinner();
    if (state !== null) {
      return state;
    }

    if (this.fullBoard()) {
      return "tie";
    }

    return null;
  }

  fourEqual(a, b, c, d) {
    return a === b && b === c && c === d && a !== "";
  }

  getWinner() {
    // HORIZONTAL CHECKING
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        if (col === 4) {
          break;
        }
        if (
          this.fourEqual(
            this.cells[row][col],
            this.cells[row][col + 1],
            this.cells[row][col + 2],
            this.cells[row][col + 3]
          )
        ) {
          return this.cells[row][col];
        }
      }
    }
    // VERTICAL CHECKING
    for (let row = 0; row < this.rows; row++) {
      if (row === 3) {
        break;
      }
      for (let col = 0; col < this.cols; col++) {
        if (
          this.fourEqual(
            this.cells[row][col],
            this.cells[row + 1][col],
            this.cells[row + 2][col],
            this.cells[row + 3][col]
          )
        ) {
          return this.cells[row][col];
        }
      }
    }
    // DIAGONAL CHECKING (NEGATIVE RISE OVER RUN)
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        try {
          if (
            this.fourEqual(
              this.cells[row][col],
              this.cells[row + 1][col + 1],
              this.cells[row + 2][col + 2],
              this.cells[row + 3][col + 3]
            )
          ) {
            return this.cells[row][col];
          }
        } catch (error) {}
      }
    }
    // DIAGONAL CHECKING (POSITIVE RISE OVER RUN)
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        try {
          if (
            this.fourEqual(
              this.cells[row][col],
              this.cells[row - 1][col + 1],
              this.cells[row - 2][col + 2],
              this.cells[row - 3][col + 3]
            )
          ) {
            return this.cells[row][col];
          }
        } catch (error) {}
      }
    }
    return null;
  }
}
