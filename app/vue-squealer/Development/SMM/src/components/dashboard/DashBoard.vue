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
import {store} from "@/store";



export default {
  name: "DashBoard",

  methods: {
    fetchVips: function (){
      const vipsUri =  VueConfig.base_url_requests+ '/' + store.getters.getVips + '/my-users/';
      fetch(vipsUri,{
        method: "GET",
      }).then((res)=>{
        if(res.ok){
          //this.$store.state.myVips.push();
          store.commit('setVips', res.json());
          console.log(res.json())
        } else console.error("Authentication failed", res.statusText);
      }).catch((error)=>{

      })
    }
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
    this.$store.state.userZero.push();
  },
};
</script>

<style></style>