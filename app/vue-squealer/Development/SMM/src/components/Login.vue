<template>
  <div class = 'container-fluid-sm m-4'>
    <form>
      <div class="form-group mt-2">
        <label for="username">Username</label>
        <input type="text" class="form-control" id="username">
      </div>
      <div class="form-group mt-2">
        <label for="password">Password</label>
        <input type="password" class="form-control" id="password">
      </div>
      <button type="submit" class="btn btn-default mt-2"
              v-on:mouseover="isOverButton = true, console.log(isOverButton)"
              v-on:mouseleave="isOverButton = false, console.log(isOverButton)"
              :class="isOverButton ? 'bg-info' : 'bg-secondary' ">Log in</button>
    </form>
  </div>


</template>

<script>
    export default {
        name : 'Login',

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