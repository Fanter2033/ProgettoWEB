<template>
  <Nav />
  <h1>DashBoard</h1>
</template>

<script>
  import Nav from "@/components/Nav.vue";
  export default {
    name: 'SmmDashBoard',
    components: {Nav},
    data(){
      return{
        userData:{
          username: '',
        }
      }
    }

  }

</script>

<style>

</style>