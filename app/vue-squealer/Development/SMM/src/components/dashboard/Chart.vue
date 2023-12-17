<template class="cool-font-small">
  <div class="container-fluid mx-0 px-0">
    <div class="row">
      <Nav/>
    </div>
    <div class="row d-flex">
      <div class="col-2">
        <SideBar/>
      </div>

      <div class="col-9 justify-content-center pt-4">
        <h2 class="chill-font-small">Popolarità degli squeal di <u>{{ this.$route.params.vip }}</u></h2>
        <div class="d-flex justify-content-center">
          <div class="container-fluid box border rounded border-secondary border-2 p-1"
               style="background-color: rgb(220,209,187) ">
            <LineChart style="background-color: rgb(220,209,187)"/>
            <div class="container">
              <div class="d-flex justify-content-start">

                <div>
                  <form class="mx-sm-auto p-1">
                    <label class="cool-font-xms" for="fromDate" style="color: #262525"><b>From</b></label>
                    <input id="fromDate"
                           v-model="fromTimeForm"
                           class="row box border rounded"
                           type="date">
                    <label class="mt-2 cool-font-xms" for="toDate" style="color: #262525"><b>To</b></label>
                    <input id="toDate"
                           v-model="toTimeForm"
                           class="row box border rounded"
                           type="date">
                  </form>
                </div>

                <div class="justify-content-center m-5 chill-font-xsm ">
                  <button class="btn green-button box" @click="this.updatePopData(this.$route.params.vip);">Update
                    Data
                  </button>
                </div>

              </div>


            </div>
          </div>
        </div>
        <h2 class="chill-font-small">Squeals di <u>{{ this.$route.params.vip }}</u></h2>
        <DoughnutChart class="mt-3 p-1"></DoughnutChart>
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
          })
          .catch((error) => {
            console.error("Network error", error);
          })
    },

    //get the squeals id of a user
    updateSquealData(vipName) {
      const squealDataUri = VueConfig.base_url_requests +
          "/utils/squeals/" +
          vipName;
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
            let arrayToCommit = [];
            for (let i = 0; i < data.length; i++) {
              arrayToCommit.push(data[i]._id);
            }
            this.$store.commit('setDoughnutChart', arrayToCommit);
          })
          .catch((error) => {
            console.error("Network error", error);
          })
    }
  },
  beforeMount() {
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