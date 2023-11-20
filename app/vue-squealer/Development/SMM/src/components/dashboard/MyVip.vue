<template>
  <!-- Elemento di menu con submenu: per ora statico con il signor romanellas -->
  <li class="dropdown">
    <a
        href="#submenu3"
        data-bs-toggle="collapse"
        class="nav-link dropdown-toggle px-0 align-middle"
        data-toggle="dropdown"
        aria-haspopup="true"
        aria-expanded="false"
    >
      <i class="fs-4 bi-person-circle mx-sm-auto icon-small"></i>   <!--qui deve prendere icona da db-->
      <span class="ms-1 d-none d-lg-inline">{{vipName}}</span>
    </a>
    <!-- Sottomenu -->
    <ul
        class="collapse nav flex-column ms-1"
        id="submenu3"
        data-bs-parent="#menu"
    >
      <li class="w-100">
        <router-link :to="{ name:'Chart', params: {vip: vipName} }">
          <i class="fs-4 bi-file-bar-graph"></i>
          <span class="d-none d-lg-inline">Charts</span>
        </router-link>
      </li>
      <li>
        <a href="#" class="nav-link px-0">
          <i class="fs-4 bi-currency-euro"></i
          ><span class="d-none d-lg-inline">Quote</span></a
        >
      </li>
      <li>
          <Squeal />
      </li>
    </ul>
  </li>
</template>

<script setup>
  import Squeal from "@/components/dashboard/Squeal.vue";
  defineProps({
    vipName: String,
  })

</script>

<style>
.icon-small {
  max-width: 100%;
  height: auto;
}
</style>