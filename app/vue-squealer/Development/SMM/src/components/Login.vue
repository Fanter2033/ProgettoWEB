<template>
  <div class="d-flex container-fluid justify-content-center">
    <div class="m-5">
      <h2 class="chill-font-small"> Social <span style="color: #c94646">M</span>edia <span
          style="color: #c94646">M</span>anager</h2>
      <form @submit.prevent="loginForm">
        <div class="form-group mt-2 chill-font-small">
          <label for="username">Nome Utente</label>
          <input
              id="username"
              v-model="formLoginValues.username"
              aria-label="Nome dell'utente"
              class="form-control"
              required
              type="text"
          />
        </div>
        <div class="form-group mt-2 chill-font-small">
          <label for="password">Password</label>
          <input
              id="password"
              v-model="formLoginValues.password"
              aria-label="password dell'utente"
              class="form-control"
              required
              type="password"
          />
        </div>

        <div class="container-fluid">
          <button
              id="login"
              :class="isOverButton ? 'green-button' : 'yellow-button'"
              aria-label="entra nel sito"
              class="btn green-button-static mt-4 chill-font-small w-100"
              type="submit"
              value="Log In"
              v-on:mouseleave="isOverButton = false"
              v-on:mouseover="isOverButton = true"
              @:click.prevent="loginForm()"
          >
            <i class="bi bi-door-open"></i>
            Log In
          </button>
        </div>


      </form>
      <div class="container-fluid">
        <form :action="goBack">
          <input class="btn red-button mt-3 chill-font-small w-100" type="submit" value="Go Back"/>
        </form>
      </div>


    </div>


  </div>
</template>

<script>
import VueConfig from "../config/VueConfig";
import router from "../router";
import {useToast} from "vue-toastification";

const toast = useToast();


export default {
  name: "Login",

  data() {
    return {
      isOverButton: false,
      goBack: VueConfig.base_url_requests,
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

    showToast(type, msg) {
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

    loginForm: function LoginForm() {
      if (
          this.formLoginValues.password.length === 0 ||
          this.formLoginValues.username.length === 0
      ) {
        alert("Tutti i campi sono obbligatori");
        return;
      }
      const passData = {password: this.formLoginValues.password};

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
              this.$store.commit('setUserZero', this.formLoginValues.username);
              router.push("/dashboard");
            } else this.showToast('warning', "autenticazione fallita")
          })
          .catch(() => {
            this.showToast('warning', "errore di rete")
          });
    },
  },
};

</script>

<style>
form {
  font-family: Optima, sans-serif;
}

h2::first-letter {
  color: #c94646;
}
</style>
