<template>
  <form>
    <div class="container-fluid mt-3">
      <div class="form-group mt-2">
        <label for="username">Username</label>
        <input type="text" class="form-control" id="username">
      </div>
      <div class="form-group mt-2">
        <label for="mail">Email</label>
        <input type="email" class="form-control" id="mail">
      </div>
      <div class="form-group mt-2">
        <label for="firName">First Name</label>
        <input type="text" class="form-control" id="firName">
      </div>
      <div class="form-group mt-2">
        <label for="secName">Second Name</label>
        <input type="text" class="form-control" id="secName">
      </div>
      <div class="form-group mt-2">
        <label for="passwd">Password</label>
        <input type="password" class="form-control" id="passwd">
      </div>
      <button type="submit" class="btn btn-default mt-2"
              v-on:mouseover="isOverButton = true, console.log(isOverButton)"
              v-on:mouseleave="isOverButton = false, console.log(isOverButton)"
              :class="isOverButton ? 'bg-info' : 'bg-secondary' ">Sign In</button>
    </div>
  </form>

</template>

<script>
  export  default {
    name: 'SignIn',
    data(){
      return{
        isOverButton : false
      }
    }
  }
</script>

<style>
form{
  font-family: Optima, sans-serif;
}
</style>