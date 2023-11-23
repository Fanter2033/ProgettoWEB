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
        <LineChart />
        <div class="container border">
          <form class="mx-sm-auto p-2">
            <label for="fromDate">From</label>
            <input type="date"
                   id="fromDate"
                   class="row"
                   v-model="fromTimeForm">
            <label for="toDate" class="mt-2">To</label>
            <input type="date"
                   id="toDate"
                   class="row"
                   v-model="toTimeForm">
          </form>
          <button class="btn mb-3" @click="this.updatePopData(this.$route.params.vip);">click me</button>
      </div>

      <div class="row">

      </div>


      </div>
    </div>
  </div>
</template>

<script>
import {defineComponent} from "vue";
import VueConfig from "@/config/VueConfig";
import SideBar from "@/components/dashboard/SideBar.vue";
import Nav from "../Nav.vue";
import LineChart from "@/components/dashboard/LineChart.vue";

export default defineComponent({
  components: { SideBar, Nav, LineChart },

  data(){
    return{
      fromTimeForm: Number,
      toTimeForm: Number,
    }
  },

  methods: {
    convertToTimeStamp: function (date){
      const newDate = new Date(date);
      return Math.floor(newDate.getTime() / 1000);
    },

    updatePopData: function (vipName){
      const ChartDataUri = VueConfig.base_url_requests +
          "/user/" +
          vipName +
          "/stats/squealPopularity?" +
          new URLSearchParams({
            fromTimestamp: this.convertToTimeStamp(this.fromTimeForm),
            toTimestamp: this.convertToTimeStamp(this.toTimeForm)
          })
      console.log("fetching: " + ChartDataUri);
      fetch(ChartDataUri, {
        method: "GET",
      })
          .then((res) => {
            if(res.ok){
              return res.json();
            }
            console.error("ERROR FETCHING VIP DATAS", res.statusText);
          })
          .then((data) => {
            this.$store.commit("setLineChartData", data);
            console.log(data);
            console.log("Chart Data: " + this.$store.getters.getLineChartData);
          })
          .catch((error) => {
            console.error("network error", error);
          })
    }
  },

});
</script>

<style></style>