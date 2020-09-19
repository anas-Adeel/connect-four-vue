<template>
  <div class="square">
    <div id="token" v-if="value === 'red'" class="circle redCircle"></div>
    <div
      id="token"
      v-else-if="value === 'yellow'"
      class="circle yellowCircle"
    ></div>
    <div id="token" v-else class="circle"></div>
  </div>
</template>

<script>
export default {
  name: "token",

  props: {
    value: String,
  },

  methods: {
    changeColorOpacity: function() {
      let element = document.getElementById("token");
      element.style.opacity = "0.5";
    },
  },
};
</script>

<style>
.square {
  width: 80px;
  height: 80px;
  background-color: blue;
  border-left: 1px solid black;
  border-right: 1px solid black;
  padding: 10px;
}

.circle {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: black;
}

.redCircle {
  background-color: red;
}

.yellowCircle {
  background-color: yellow;
}
</style>
