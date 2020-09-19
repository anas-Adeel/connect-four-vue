<template>
  <h2>{{ stateToMsg[state] }}</h2>
</template>

<script>
export default {
  name: "winner",

  data: function() {
    return {
      stateToMsg: {
        red: "Congratulations! You Have Won",
        yellow: "The AI Prevails! You Have Lost",
        tie: "It's A Tie",
      },
    };
  },

  props: {
    state: String,
  },
};
</script>

<style>
h2 {
  font-family: "Kufam", cursive;
  font-size: 32px;
}
</style>
