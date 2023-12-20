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
        <div class="container-fluid d-flex justify-content-end align-items-end justify-content-end align-content-end m-0 p-0">
          <img alt="Responsive image" class="img-fluid position-static m-0" src="/media/SforSqueal.jpeg">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Nav from "../Nav.vue";
import SideBar from "@/components/dashboard/SideBar.vue";
import VueConfig from "@/config/VueConfig";
import {store} from "@/store";
import LineChart from "@/components/dashboard/LineChart.vue";
import NavAndSide from "@/components/NavAndSide.vue";

export default {
  name: "DashBoard",

  methods: {
    fetchVips: function () {
      const vipsUri =
          VueConfig.base_url_requests +
          "/user/" +
          store.getters.getUserZero +
          "/my-users/";

      fetch(vipsUri, {
        method: "GET",
        credentials: 'include',
        mode: 'cors'
      })
          .then((res) => {
            if (res.ok)
              return res.json();
            console.error("ERROR FETCHING VIPS", res.statusText);
          })
          .then((data) => {
            this.$store.commit("setVips", data);
          })
          .catch((error) => {
            console.error("network error", error);
          });
    },

  },

  computed: {
    userZero() {
      return this.$store.state.userZero;
    },
    myVips() {
      return this.$store.state.myVips;
    },
  },

  components: {NavAndSide, LineChart, SideBar, Nav},

  beforeMount() {
    this.fetchVips();
  },
};
</script>

<style>
</style>