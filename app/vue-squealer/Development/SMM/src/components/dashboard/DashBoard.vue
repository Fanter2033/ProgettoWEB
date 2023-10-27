<template>
  <Nav />
  <h1> {{ userZero[0] }} </h1>
  <Home />

</template>

<script>
import Nav from "../Nav.vue";
import Home from "./Home.vue";

export default {
    name:'DashBoard',

    computed:{
      userZero() { return this.$store.state.userZero }
    },

    components : {Home, Nav},

  }
</script>

<style>

</style>