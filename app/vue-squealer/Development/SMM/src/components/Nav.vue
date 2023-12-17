<template>

  <div id="app">
    <nav class="navbar navbar-expand-sm navbar-dark chill-font-xsm" role="navigation"
         style="width: 100%; font-size:large">
      <div class="container-fluid" style="width: 100%;">
        <div class="navbar-header">
          <div class="navbar-brand">
            <router-link aria-label="home" to="/dashboard"><img alt="Logo" class="img-fluid" src="/media/Nav_logo.png"
                                                                width="60"></router-link>
            <span class="mx-3 d-none d-lg-inline cool-font-xsm"> Squealer <b>Smm</b> </span>
          </div>
        </div>

        <ul class="nav justify-content-end">
          <li class="nav-item"><a class="nav-link">
            <router-link aria-label="controlla i vip collegati" to="/my-vips/">
              <i class="bi bi-person-check"></i>
              <span aria-label="account collegati" class="mx-3 d-none d-lg-inline">Accounts collegati</span>
            </router-link>
          </a></li>
          <li class="nav-item"><a aria-label="esci dal sito" class="nav-link" role="button"
                                  @click="logOut" style="color: #E0BB76F9">
            <i class="bi bi-box-arrow-right"></i>
            <span class="mx-3 d-none d-lg-inline">Log Out</span>
          </a></li>
        </ul>
      </div>
    </nav>
  </div>

</template>

<script>
import VueConfig from "@/config/VueConfig";
import router from "../router"

export default {
  name: 'Nav',
  methods: {
    logOut() {
      console.log("bye");
      const uri = VueConfig.base_url_requests + '/auth/logout';
      fetch(uri, {
        method: 'POST',
        credentials: 'include',
        mode: 'cors',
        headers: {
          "Content-Type": "application/json",
        }
      })
          .then((res) => {
            if (res.ok) {
              router.push("/")
            }
          })
          .catch((error) => {
            console.error("Network error", error);
          })
    }
  }
}
</script>

<style>

a {
  color: var(--squeal-yellow);
  text-decoration: none;
}

.navbar {
  background-color: #528b57;
}


</style>