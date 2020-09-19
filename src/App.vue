<template>
  <div id="app">
    <div>
      <h1 class="title">Connect Four With Vue</h1>
    </div>

    <div><winner :state="getStateOfBoard()" /></div>

    <div>
      <token-slider
        v-on:slider-clicked="dropToken"
        :width="715"
        :height="100"
      ></token-slider>
    </div>

    <div>
      <div
        class="token"
        v-bind:key="rowIndex"
        v-for="(row, rowIndex) in board.cells"
      >
        <div v-bind:key="pos" v-for="(elt, pos) in row">
          <token v-bind:value="elt"></token>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Board from "./Board.js";
import Token from "./components/Token.vue";
import TokenSlider from "./components/TokenSlider.vue";
import Winner from "./components/Winner.vue";

export default {
  name: "App",

  data() {
    return {
      board: new Board(),
      cols: 7,
      rows: 6,
    };
  },

  components: {
    Token,
    TokenSlider,
    Winner,
  },

  methods: {
    getStateOfBoard: function() {
      return this.board.stateOfBoard();
    },

    printStateOfBoard: function() {
      const gameState = this.getStateOfBoard();
      if (gameState !== null) {
        console.log(`The state of the board is ${gameState}`);
      }
    },

    dropToken: function(event) {
      this.printStateOfBoard();
      if (this.getStateOfBoard() !== null) {
        return;
      }

      let scale = 715 / 7;
      let colIndex = Math.floor(event.offsetX / scale);
      let rowIndex = this.board.getRowOfCol(colIndex);
      if (rowIndex === null) {
        return;
      }

      this.board.cells[rowIndex][colIndex] = "red";
      this.$forceUpdate();
      this.board.bestMove();
      this.printStateOfBoard();
    },
  },
};
</script>

<style>
h1 {
  font-family: "Kufam", cursive;
}
.token {
  align-items: center;
  display: flex;
  flex-wrap: wrap;
}
.title {
  text-align: center;
  font-family: "arial";
  font-size: 250%;
}
</style>
