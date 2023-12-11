<template>

  <div id = "app">
    <nav class="navbar navbar-expand-sm navbar-dark ">
        <div class="container-fluid">
            <div class="navbar-header">
              <div class="navbar-brand">
                <router-link to="/dashboard"><img src="/media/Nav_logo.png" alt="Logo" width="60" > </router-link>

                <span class="mx-3 d-none d-lg-inline"> Squealer <b>Smm</b> </span>
              </div>
            </div>
            <ul class="navbar-nav">
                <li class="nav-item"><a class="nav-link"><router-link to="/my-vips/">Linked Accounts</router-link></a></li>
                <li class="nav-item"><a class="nav-link"><router-link to="/dashboard">Settings</router-link></a></li>
            </ul>
        </div>
    </nav>
  </div>

</template>

<script>
    export default {
        name : 'Nav'
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