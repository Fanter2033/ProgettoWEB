<template>
    
  <div id = "app">
    <nav class="navbar navbar-expand-sm bg-dark navbar-dark ">
        <div class="container-fluid">
            <div class="navbar-header">
                <a class="navbar-brand" href="#">
                    <img src=""
                        height="40 px"
                        loading="lazy">
                </a>
            </div>
            <ul class="navbar-nav">
                <li class="nav-item"><a class="nav-link"><router-link to="/dashboard/graphs">Linked Accounts</router-link></a></li>
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