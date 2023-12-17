<template>
  <!-- Elemento di menu con submenu -->
  <li class="nav-item chill-font-xsm">
    <div class="py-1 px-1 d-flex">
      <i class="fs-4 bi-person-circle m-1 ps-3"></i>   <!--TODO: get_pfp(username)-->
      <span class="ms-1 d-none d-lg-inline">{{ vipName }}</span>
      <a :aria-expanded="isCollapse"
         class="align-items-center dropdown-toggle"
         data-bs-target="#submenu"
         data-bs-toggle="collapse"
         @click="toggleCollapse"></a>
    </div>
    <!-- Sottomenu -->
    <ul
        :class="{ show: !isCollapse }"
        class="collapse nav flex-column ms-1 p-2 pt-0"
    >
      <li class="py-1">
        <router-link :to="{ name:'Chart', params: {vip: vipName} }" aria-label="grafici">
          <i class="fs-4 bi-file-bar-graph"></i>
          <span class="d-none d-lg-inline">Charts</span>
        </router-link>
      </li>
      <li class="py-1">
        <router-link :to="{ name:'Quote', params: {vip: vipName} }" aria-label="situazione quota">
          <i class="fs-4 bi-currency-euro"></i
          ><span class="d-none d-lg-inline">Quote</span>
        </router-link>
      </li>
      <li class="py-1">
        <router-link :to="{ name:'Squeal', params: {vip: vipName} }" aria-label="scrivi uno squeal"
                     class="border rounded p-1 border-warning box" style="background-color: #528b57">
          <i class="bi bi-send"></i>
          <span class="d-none d-lg-inline">Quick Squeal</span>
        </router-link>
      </li>

    </ul>
  </li>
</template>

<script setup>
import Squeal from "@/components/dashboard/Squeal.vue";
import {ref} from "vue";

defineProps({
  vipName: String,
})

const isCollapse = ref(false);

function toggleCollapse() {
  isCollapse.value = !isCollapse.value;
}

</script>

<style>

</style>