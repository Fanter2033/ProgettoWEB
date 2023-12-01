<template>
  <div class="container-fluid-sm m-4">
    <form @submit.prevent="loginForm">
      <div class="form-group mt-2">
        <label for="username">Username</label>
        <input
          type="text"
          class="form-control"
          id="username"
          v-model="formLoginValues.username"
        />
      </div>
      <div class="form-group mt-2">
        <label for="password">Password</label>
        <input
          type="password"
          class="form-control"
          id="password"
          v-model="formLoginValues.password"
        />
      </div>
      <input
        type="submit"
        class="btn btn-default mt-2"
        @:click.prevent="loginForm()"
        v-on:mouseover="isOverButton = true"
        v-on:mouseleave="isOverButton = false"
        :class="isOverButton ? 'bg-info' : 'bg-secondary'"
      />
    </form>
  </div>
</template>

<script>
import VueConfig from "../config/VueConfig";
import router from "../router";
import VueCookies from 'vue-cookies'

export default {
  name: "Login",

  data() {
    return {
      isOverButton: false,

      formLoginValues: {
        username: "",
        password: "",
      },
    };
  },

  computed: {
    userZero() {
      return this.$store.state.getUserZero;
    },
  },

  methods: {
    loginForm: function LoginForm() {
      if (
        this.formLoginValues.password.length === 0 ||
        this.formLoginValues.username.length === 0
      ) {
        alert("Tutti i campi sono obbligatori");
        return;
      }
      const passData = { password: this.formLoginValues.password };

      let uri = `${VueConfig.base_url_requests}/auth/${this.formLoginValues.username}/1`;

      fetch(uri, {
        method: "POST",
        mode: 'cors',
        credentials: 'include',
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify(passData)
      })
        .then((res) => {
          if (res.ok) {

            const connectSidCookie = res.headers.get('set-cookie');
            VueCookies.set('connect.sid', connectSidCookie);

            this.$store.commit('setUserZero',this.formLoginValues.username);
            router.push("/dashboard");
          } else console.error("Authentication failed", res.statusText);
        })
        .catch((error) => {
          console.error("network error", error);
        });
      //router.push("/dashboard"); // !!!!!!
    },
  },
};

</script>

<style>
form {
  font-family: Optima, sans-serif;
}
</style>

//TODO: add a searchbar