<template>
  <!-- Contenitore principale -->
  <div class="container-fluid">
    <!-- Riga principale con flex-nowrap (senza wrap) -->
    <div class="row flex-nowrap">
      <!-- Colonna laterale sinistra (barra laterale) -->
      <div class="col-auto px-sm-2 px-0 bg-dark">
        <!-- Contenuto della barra laterale -->
        <div
          class="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 text-white min-vh-100"
        >
          <!-- Logo o link alla home -->
          <div
            class="d-flex align-items-center pb-3 mb-md-0 me-md-auto text-white text-decoration-none"
          >
            <span class="fs-5 d-none d-sm-inline">Your Vips</span>
          </div>
          <!-- Lista di elementi di navigazione (menu) -->
          <ul
            class="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start"
            id="menu"
          >

            <template v-for="vip in myVips ">
              <MyVip :vip-name = "vip" ></MyVip>
            </template>



          </ul>
          <!-- Linea divisoria -->
          <hr />
          <!-- Dropdown per il profilo dell'utente -->
          <div class="dropdown pb-4">
            <!-- Menu dropdown per il profilo dell'utente -->
            <ul
              class="dropdown-menu dropdown-menu-dark text-small shadow"
              aria-labelledby="dropdownUser1"
            >
              <li><a class="dropdown-item" href="#">New Vip</a></li>
              <li><a class="dropdown-item" href="#">Settings</a></li>
              <li><a class="dropdown-item" href="#">Profile</a></li>
              <li>
                <hr class="dropdown-divider" />
              </li>
              <li><a class="dropdown-item" href="#">Sign out</a></li>
            </ul>
          </div>
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
