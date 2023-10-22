<template>
    
  <div id = "app">
    <nav class="navbar navbar-expand-sm bg-dark navbar-dark ">
        <div class="container-fluid">
            <div class="navbar-header">
                <a class="navbar-brand" href="#">
                    <img src="http://localhost:8000/media/logo_negative.jpeg"
                        height="40 px"
                        loading="lazy">
                </a>
            </div>
            <ul class="navbar-nav">
                <li class="nav-item"><a class="nav-link"><router-link to="/login">Login</router-link></a></li>
                <li class="nav-item"><a class="nav-link"><router-link to="/signIn">Sign In</router-link></a></li>
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

</style>