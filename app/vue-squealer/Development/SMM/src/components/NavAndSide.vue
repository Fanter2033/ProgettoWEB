<template>
  <div class="container-fluid mx-0 px-0">
    <div class="row">
      <Nav/>
    </div>
    <div class="row d-flex">
      <div class="col-2 position-fixed">
        <SideBar/>
      </div>

      <div v-if="isDashboard" class="col-10" style="margin-left: 16.666667%;">
        <h1>Welcome Back <b> {{ userZero }} </b> :)</h1>
      </div>

    </div>
  </div>
</template>

<script>
import Nav from "@/components/Nav.vue";
import SideBar from "@/components/dashboard/SideBar.vue";

export default {
  name: "NavAndSide",
  components: {SideBar, Nav},
  props: ['userZero', 'isDashboard']
}
</script>