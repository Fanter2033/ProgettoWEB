<template>
  <Nav />
  <Home />
  <SideBar />

</template>

<script>
import Nav from "../Nav.vue";
import Home from "./Home.vue";
import SideBar from "@/components/dashboard/SideBar.vue";

export default {
    name:'DashBoard',

    computed:{
      userZero() { return this.$store.state.userZero }
    },

    components : {SideBar, Home, Nav},

  }
</script>

<style>

</style>