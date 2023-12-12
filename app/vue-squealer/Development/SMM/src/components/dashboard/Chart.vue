<template>
  <div class="container-fluid mx-0 px-0">
    <div class="row">
      <Nav/>
    </div>
    <div class="row d-flex">
      <div class="col-2">
        <SideBar/>
      </div>

      <div class="col-9 justify-content-center pt-4">
        <h2>Popolarità degli squeal di <b>{{this.$route.params.vip}}</b></h2>
        <div class="d-flex justify-content-center ">
          <div class="container-fluid border rounded border-secondary border-2 p-1" style="background-color: whitesmoke">
            <LineChart style="background-color: whitesmoke"/>
            <div class="container border rounded ">
              <div class="d-flex justify-content-start ">

                <div>
                  <form class="mx-sm-auto p-1">
                    <label for="fromDate">From</label>
                    <input id="fromDate"
                           v-model="fromTimeForm"
                           class="row border rounded"
                           type="date">
                    <label class="mt-2" for="toDate">To</label>
                    <input id="toDate"
                           v-model="toTimeForm"
                           class="row border rounded"
                           type="date">
                  </form>
                </div>

                <div class="justify-content-center m-5">
                  <button class="btn" @click="this.updatePopData(this.$route.params.vip);">update data</button>
                </div>

              </div>


            </div>
          </div>
        </div>
        <h2>Squeals di <b>{{this.$route.params.vip}}</b></h2>
        <DoughnutChart class="mt-3 border rounded p-1"></DoughnutChart>
      </div>

    </div>
  </div>
</template>

<script>
import {defineComponent, ref, watch} from "vue";
import VueConfig from "@/config/VueConfig";
import SideBar from "@/components/dashboard/SideBar.vue";
import Nav from "../Nav.vue";
import LineChart from "@/components/dashboard/LineChart.vue";
import DoughnutChart from "@/components/dashboard/DoughnutChart.vue";


export default defineComponent({
  components: {SideBar, Nav, LineChart, DoughnutChart},

  data() {
    return {
      fromTimeForm: Number,
      toTimeForm: Number,
    }
  },

  methods: {
    convertToTimeStamp: function (date) {
      const newDate = new Date(date);
      return Math.floor(newDate.getTime() / 1000);
    },

    updatePopData: function (vipName) {
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
        credentials: 'include',
        mode: 'cors'
      })
          .then((res) => {
            if (res.ok) {
              return res.json();
            }
            console.error("ERROR FETCHING VIP DATAS", res.statusText);
          })
          .then((data) => {
            this.$store.commit("setLineChartData", data);
            //console.log(data);
            //console.log("Chart Data: " + this.$store.getters.getLineChartData);
          })
          .catch((error) => {
            console.error("Network error", error);
          })
    },

    updateSquealData(vipName) {
      const squealDataUri = VueConfig.base_url_requests +
          "/utils/squeals/" +
          vipName;
      console.log("fetching: " + squealDataUri);
      fetch(squealDataUri, {
        method: 'GET',
        credentials: 'include',
        mode: 'cors',
      })
          .then((res) => {
            if (res.ok) {
              return res.json();
            }
            console.error("Error fetching data");
          })
          .then((data) => {
            this.$store.commit('setDoughnutChart', data);
            console.log(data[0]);
          })
          .catch((error) => {
            console.error("Network error", error);
          })
    }
  },
  mounted() {
    this.$store.commit('setLineChartData', {})
    this.updateSquealData(this.$route.params.vip);
  },
  updated() {
    this.$store.commit('setLineChartData', {})
    this.updateSquealData(this.$route.params.vip);
  },

});
</script>

<style>
</style>