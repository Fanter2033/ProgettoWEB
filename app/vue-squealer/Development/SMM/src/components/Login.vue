<template>
  <div class = 'container-fluid-sm m-4'>
    <form>
      <div class="form-group mt-2">
        <label for="username">Username</label>
        <input type="text" class="form-control" id="username" v-model = "formLoginValues.username">
      </div>
      <div class="form-group mt-2">
        <label for="password">Password</label>
        <input type="password" class="form-control" id="password" v-model = "formLoginValues.password">
      </div>
      <input type="submit" class="btn btn-default mt-2" v-on:click="loginForm()"
              v-on:mouseover="isOverButton = true"
              v-on:mouseleave="isOverButton = false"
              :class="isOverButton ? 'bg-info' : 'bg-secondary'">
    </form>
  </div>


</template>

<script>
import VueConfig from "../config/VueConfig";
import {func} from "joi";

    export default {
        name : 'Login',
        data(){
            return{
                isOverButton : false,

                formLoginValues:{
                  username:'',
                  password:'',
                },
            }
        },
        methods:{
          loginForm: function LoginForm() {
            const passData = { password:this.formLoginValues.password };

            let uri = `${VueConfig.base_url_requests}/auth/${this.formLoginValues.username}/1`;

            fetch(uri, {
                 method: "POST",
                 headers: {
                   "Content-Type": "application/json",
                   "Access-Control-Allow-Origin": "*",
                 },
                 body: JSON.stringify(passData),
               }
            ).then( (res) => {
                 if(res.ok)
                   console.log("evviva");
                 else
                   console.error("Authentication failed", res.statusText);
               }
            ).catch((error) => {
              console.error("network error",error);
            })
        }
      }
    }
</script>

<style>
form{
  font-family: Optima, sans-serif;
}
</style>