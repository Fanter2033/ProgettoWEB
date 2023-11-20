<template>
  <div class="container-fluid mx-0 px-0">
    <div class="row">
      <Nav/>
    </div>
    <div class="row d-flex">
      <div class="col-2">
        <SideBar/>
      </div>

      <div class="col-10">
        Quote of {{ vipName }}
      </div>

    </div>
  </div>
</template>

<script setup>
import Nav from "@/components/Nav.vue";
import SideBar from "@/components/dashboard/SideBar.vue";
import VueConfig from "@/config/VueConfig";

const props = defineProps({
  vipName: String,
})

let quote = {
  daily: Number,
  weekly: Number,
  monthly: Number,
}

function getQuoteInfo() {
  const uri = VueConfig.base_url_requests +
      '/user/' +
      props.vipName +
      '/quote';
  console.log(uri);
  fetch(uri, {
    method: 'GET'
  })
      .then((res) =>{
        if(res.ok)
          return res.json();
        console.error("Error fetching quote data");
      })
      .then((data)=>{
        console.log(data);
      })
      .catch((error) => {
        console.error("Network error");
      })
}

</script>