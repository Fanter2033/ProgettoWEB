<template>

  <div id = "app">
    <nav class="navbar navbar-expand-sm navbar-dark " style="width: 100%;">
        <div class="container-fluid" style="width: 100%;">
            <div class="navbar-header">
              <div class="navbar-brand">
                <router-link to="/dashboard"><img src="/media/Nav_logo.png" alt="Logo" width="60" > </router-link>
                <span class="mx-3 d-none d-lg-inline"> Squealer <b>Smm</b> </span>
              </div>
            </div>

            <ul class="nav justify-content-end">
                <li class="nav-item"><a class="nav-link">
                  <router-link to="/my-vips/">
                    <i class="bi bi-person-check"></i>
                  <span class="mx-3 d-none d-lg-inline">Linked Accounts </span>
                </router-link></a></li>
                <li class="nav-item"><a class="nav-link" @onclick="this.logOut()">
                  <router-link to="/">
                    <i class="bi bi-box-arrow-right"></i>
                    <span class="mx-3 d-none d-lg-inline">Log Out</span>
                  </router-link></a></li>
            </ul>
        </div>
    </nav>
  </div>

</template>

<script>
    import VueConfig from "@/config/VueConfig";

    export default {
        name : 'Nav',
        methods: {
          logOut(){
            const uri = VueConfig.base_url_requests +'/auth/logout';
            fetch(uri,{
              method: 'POST',
              credentials: 'include',
              mode: 'cors',
            })
                .then((res)=>{
                  if(!res.ok)
                    console.error("Error logging out")
                })
                .catch((error)=>{
                  console.error("Network error", error);
                })
          }
        }
    }
</script>

<style>

a{
  color: darkgrey;
  text-decoration: none;
}

.navbar{
  background-color: #528b57;
}



</style>