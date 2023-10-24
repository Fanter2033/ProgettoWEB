
<template>

      <router-view />

</template>

<script>
import Nav from "@/components/Nav.vue";
import Login from "@/components/Login.vue";

export default {
  name : 'App',
  components: {
    Nav,
    Login
  }
}
</script>

<style>

</style>