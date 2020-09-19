<template>
  <div>
    <canvas
      class="sliderCanvas"
      id="sliderCanvas"
      v-on:mousemove="drawToken"
      v-on:click="dropToken"
      v-bind:width="width"
      v-bind:height="height"
    >
    </canvas>
  </div>
</template>

<script>
export default {
  name: "token-slider",

  props: {
    width: Number,
    height: Number,
  },

  computed: {
    canvas: function() {
      return document.getElementById("sliderCanvas");
    },

    context: function() {
      return this.canvas.getContext("2d");
    },
  },

  methods: {
    drawToken: function(event) {
      this.context.fillStyle = "blue";
      this.context.fillRect(0, 0, this.width, this.height);
      // THIS IS WHERE THE CIRCLE IS DRAWN
      this.context.beginPath();
      this.context.arc(event.offsetX, this.height / 2, 40, 0, Math.PI * 2);
      this.context.fillStyle = "red";
      this.context.fill();
    },

    enemyMove: function(event) {
      this.$parent.board.bestMove();
      this.$parent.$forceUpdate();
    },

    getStateOfBoard: function() {
      return this.$parent.board.stateOfBoard();
    },

    printTheStateOfBoard: function() {
      let gameState = this.getStateOfBoard();
      if (gameState === null) {
        return;
      }
      console.log(`the winner of the board is ${gameState}`);
    },

    dropToken: function(event) {
      this.$emit("slider-clicked", event);
    },
  },
};
</script>

<style>
.sliderCanvas {
  background-color: blue;
}
</style>
