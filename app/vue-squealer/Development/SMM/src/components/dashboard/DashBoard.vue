<template>
  <div>
    <Nav />
    <SideBar />
  </div>
</template>

<script>
import Nav from "../Nav.vue";
import SideBar from "@/components/dashboard/SideBar.vue";
import VueConfig from "@/config/VueConfig";
import { store } from "@/store";

export default {
  name: "DashBoard",

  methods: {
    fetchVips: function () {
      console.log("user: " + store.getters.getUserZero);
      const vipsUri =
        VueConfig.base_url_requests +
        "/user/" +
        store.getters.getUserZero +
        "/my-users/";
      console.log("fetching: " + vipsUri);

      fetch(vipsUri, {
        method: "GET",
      })
        .then((res) => {
          if (res.ok)
            return res.json();
          console.error("ERROR FETCHING VIPS", res.statusText);
        })
        .then((data) => {
          console.log("my vips: " + data);
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

  components: { SideBar, Nav },

  beforeMount() {
    this.fetchVips();
  },
};
</script>

<style></style>