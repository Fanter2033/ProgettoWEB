<template>

  <router-view/>

</template>

<script>
import {useToast} from "vue-toastification";

const toast = useToast()
export default {

  name: 'App',
  methods: {
    //toast functions
    showToast(type,msg) {
      const options = {
        position: "top-right",
        timeout: 5000,
        closeOnClick: true,
        pauseOnFocusLoss: true,
        pauseOnHover: true,
        draggable: true,
        draggablePercent: 0.6,
        showCloseButtonOnHover: false,
        hideProgressBar: true,
        closeButton: "button",
        icon: true,
        rtl: false
      }
      if (type === 'success')
        toast.success(msg, options);
      else if (type === 'warning')
        toast.warning(msg, options);
    },

  },
  mounted() {
    //this.getLinkedVips();
  },
  beforeUnmount() {
    localStorage.clear();
  }

}
</script>

<style>
@import "/css/App.css";

</style>