<template>
  <div class="container-fluid mx-0 px-0">
    <div class="row">
      <Nav/>
    </div>
    <div class="row d-flex">
      <div class="col-2">
        <SideBar/>
      </div>

      <div class="col-10 pt-sm-5 pt-3">
        <h1>Quote's situation of <b>{{ VipName }}</b></h1>
        <button
            id="greenButton"
            class="btn"
            @click="getQuoteInfo">
          <i class="bi bi-arrow-clockwise"></i>
          Refresh
        </button>

        <div class="card mt-3">
          <div class="card-body">
            <h4>Daily quote remaining: <b>{{quote.rem_daily}}</b></h4>
<!--            <div style="height: 50px">-->
<!--              <Pie :data="data" :options="options"  />-->
<!--            </div>-->

            <h4>Weekly quote remaining: <b>{{quote.rem_weekly}}</b></h4>
            <h4>Monthly quote remaining: <b>{{quote.rem_monthly}}</b></h4>
          </div>
        </div>

        <div class="card mt-3">
          <div class="card-body">
            <h4>Daily quote limit: <b>{{quote.limit_daily}}</b></h4>
            <h4>Weekly quote limit: <b>{{quote.limit_weekly}}</b></h4>
            <h4>Monthly quote limit: <b>{{quote.limit_monthly}}</b></h4>
          </div>
        </div>


        <button class="btn bg-warning mt-3" @mouseover="isMouseOver=true" @mouseleave="isMouseOver=false">
          <i v-if="!isMouseOver" class="bi bi-lightning"></i>
          <i v-if="isMouseOver" class="bi bi-lightning-fill"></i>
          Quick Refill
        </button>
        <p><i>you cannot remain mute for lack of characters...</i></p>
        <img src="../../../public/media/post.gif" alt="post" style="height: 100px">

      </div >

    </div>
  </div>
</template>

<script setup>
import Nav from "@/components/Nav.vue";
import SideBar from "@/components/dashboard/SideBar.vue";
import VueConfig from "@/config/VueConfig";
import { useRoute } from 'vue-router'
import { onMounted, onUpdated, watch} from "vue";
import {ref} from "vue";

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
//import { Pie } from 'vue-chartjs'

const route = useRoute();
const VipName = ref('');
const isMouseOver = ref(false);

onMounted(()=>{
  VipName.value = route.params.vip;
  getQuoteInfo();
})

onUpdated(()=>{
  VipName.value = route.params.vip;
})

watch(VipName, ()=>{
  getQuoteInfo();
})

let quote = ref({});

function getQuoteInfo() {
  const uri = VueConfig.base_url_requests +
      '/user/' +
      VipName.value +
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
        quote.value = {
          limit_daily: data.limit_daily,
          limit_weekly: data.limit_weekly,
          limit_monthly: data.limit_monthly,
          rem_daily: data.remaining_daily,
          rem_weekly: data.remaining_weekly,
          rem_monthly: data.remaining_monthly
        }
      })
      .catch((error) => {
        console.error("Network error", error);
      })
}

ChartJS.register(ArcElement, Tooltip, Legend)
const data = {
  datasets: [
    {
      backgroundColor: ['#272a27','#ffffff'],
      data: [(quote.value.rem_daily)/10,50]
    }
  ]
}
const options = {
  responsive: true,
}
</script>