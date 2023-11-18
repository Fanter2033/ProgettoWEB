<template>
  <div class="container-fluid mx-0 px-0">
    <div class="row">
      <Nav />
    </div>
    <div class="row d-flex">
      <div class="col-2">
        <SideBar />
      </div>
      <div class="col-10">
        <LineChart/>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import SideBar from "@/components/dashboard/SideBar.vue";
import Nav from "../Nav.vue";
import LineChart from "@/components/dashboard/LineChart.vue";

export default defineComponent({
  components: { SideBar, Nav, LineChart},

  methods: {
    updatePopData: function (username){

    }
  }
});
</script>

<style></style>