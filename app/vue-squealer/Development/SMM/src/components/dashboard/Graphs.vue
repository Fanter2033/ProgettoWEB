<template>
  <div class="container-fluid mx-0 px-0">
    <div class="row">
      <Nav />
    </div>
    <div class="row d-flex">
      <div class="col-2">
        <SideBar />
      </div>
      <div class="col-10 ">
        qui ce stanno i grafici
      </div>
    </div>
  </div>

</template>

<script>

import Nav from "@/components/Nav.vue";
import SideBar from "@/components/dashboard/SideBar.vue";

import { Bar } from 'vue-chartjs'


export default {
  components: {SideBar, Nav, Bar}
}
</script>

<style>

</style>