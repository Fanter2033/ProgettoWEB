<template>
  <div class="container-fluid mx-0 px-0">
    <div class="row">
      <Nav />
    </div>
    <div class="row d-flex">
      <div class="col-2">
        <SideBar />
      </div>
      <div class="col-10">qui ce stanno i grafici
        <img src="https://static.wikia.nocookie.net/silly-cats/images/0/08/Millybleh.jpg/" alt="sillicato" />
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import SideBar from "@/components/dashboard/SideBar.vue";

export default defineComponent({
  components: { SideBar },
});
</script>

<style></style>