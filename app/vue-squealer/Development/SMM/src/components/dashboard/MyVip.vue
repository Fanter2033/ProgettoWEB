<template>
  <!-- Elemento di menu con submenu: per ora statico con il signor romanellas -->
  <li class="mb-2">
    <div class="py-1 px-1 d-flex">
    <i class="fs-4 bi-person-circle mx-lg-1 icon-small"></i>   <!--qui deve prendere icona da db-->
    <span class="ms-1 d-none d-lg-inline">{{vipName}}</span>
    <a      href="#submenu"
            class="align-items-center dropdown-toggle"
            data-bs-toggle="collapse"
            data-bs-target="#submenu"
            @click="toggleCollapse"
            :aria-expanded="isCollapse"></a>
    </div>
    <!-- Sottomenu -->
    <ul
        class="collapse nav flex-column ms-1"
        :class="{ show: !isCollapse }"
    >
      <li class="py-1">
        <router-link :to="{ name:'Chart', params: {vip: vipName} }">
          <i class="fs-4 bi-file-bar-graph"></i>
          <span class="d-none d-lg-inline">Charts</span>
        </router-link>
      </li>
      <li class="py-1">
        <router-link :to="{ name:'Quote', params: {vip: vipName} }">
            <i class="fs-4 bi-currency-euro"></i
            ><span class="d-none d-lg-inline">Quote</span>
        </router-link>
      </li>
      <li>
        <div>
          <Squeal />
        </div>
      </li>
    </ul>
  </li>
</template>

<script setup>
  import Squeal from "@/components/dashboard/Squeal.vue";
  import * as constants from "constants";
  import {ref} from "vue";
  defineProps({
    vipName: String,
  })

  const isCollapse = ref(false);
  function toggleCollapse(){
    isCollapse.value = !isCollapse.value;
  }

</script>

<style>

</style>