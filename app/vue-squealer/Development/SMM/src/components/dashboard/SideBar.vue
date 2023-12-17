<template>
  <!-- Contenitore principale -->
  <div class="container-fluid " role="navigation" style="height: 100%;">
    <!-- Riga principale con flex-nowrap (senza wrap) -->
    <div class="row flex-nowrap" style="height: 100%">
      <!-- Colonna laterale sinistra (barra laterale) -->
      <div class="col-auto px-sm-2 px-0 bg-dark">
        <!-- Contenuto della barra laterale -->
        <div
            class="d-flex flex-column align-items-center align-items-md-start pt-2 text-white min-vh-100"
        >
          <!-- Logo o link alla home -->
          <div
              class="d-flex align-items-center pb-3 mb-md-0 me-md-auto text-white text-decoration-none"
          >
            <span class="fs-5 d-none d-sm-inline cool-font-xsm">Your Vips</span>
          </div>
          <!-- Lista di elementi di navigazione (menu) -->
          <ul
              id="menu"
              class="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start"
          >

            <template v-for="vip in myVips ">
              <MyVip :vip-name="vip"></MyVip>
            </template>

          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import MyVip from "@/components/dashboard/MyVip.vue";

export default {
  name: "SideBar",
  computed: {
    myVips() {
      return this.$store.state.myVips;
    },
  },
  components: {MyVip}
};
</script>

<style>
</style>
