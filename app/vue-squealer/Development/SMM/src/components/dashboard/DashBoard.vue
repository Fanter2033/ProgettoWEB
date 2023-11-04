<template>
  <div>
    <Nav />
    <SideBar />
  </div>

</template>

<script>
import Nav from "../Nav.vue";
import SideBar from "@/components/dashboard/SideBar.vue";

export default {
    name:'DashBoard',

    computed:{
      userZero() { return this.$store.state.userZero }
    },

    components : {SideBar, Nav},

  }
</script>

<style>

</style>