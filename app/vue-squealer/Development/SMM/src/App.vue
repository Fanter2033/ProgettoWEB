<template>

  <router-view/>

</template>

<script>
import {useToast} from "vue-toastification";

const toast = useToast()
export default {

  name: 'App',
  methods: {
    //toast functions
    showToast(type,msg) {
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

  },
  mounted() {
    //this.getLinkedVips();
  },
  beforeUnmount() {
    localStorage.clear();
  }

}
</script>

<style>
/* -------------------- COLOR STUFF ------------------*/
:root {
  --squeal-green: #528b57;
  --squeal-blue: #072f38;
  --squeal-yellow: rgba(224, 187, 118, 0.98);
  --squeal-red: #b45656;
  --squeal-pink: #b879b8;
}

.my-green {
  background-color: var(--squeal-green);
}
.my-yellow {
  background-color: var(--squeal-yellow);
}
.my-blu {
  background-color: var(--squeal-blue);
  color: var(--squeal-green);
}
.no-bg {
  background-color: transparent;
}
.icon-my-color {
  fill: var(--squeal-red);
}

/* ------------ ATTENZIONE AGLI ALTRI FILE CSS -------------*/
html {
  text-align: center;
  background-color: var(--squeal-blue);
  color: var(--squeal-yellow);

  margin: 0;
  padding: 0;

  display: flex;
  flex-direction: column;
  min-height: 100vh;

  overflow-x: hidden;
}
body {
  background-color: var(--squeal-blue);
  color: var(--squeal-yellow);
}
.App {
  text-align: center;
  background-color: var(--squeal-blue);
  color: var(--squeal-yellow);
}

/* -----------------SQUEAL CARD STUFF------------------ */
.squeal {
  background-color: var(--squeal-yellow) !important;
  color: var(--squeal-green) !important;
}

.offers {
  background-color: var(--squeal-green) !important;
  color: var(--squeal-blue) !important;
}

/* -----------------FONT STUFF------------------ */
.cool-font {
  font-family: "Cool-Font", sans-serif;
  font-size: 10vw;
}
.cool-font-medium {
  font-family: "Cool-Font", sans-serif;
  font-size: 5vw;
}
.cool-font-small {
  font-family: "Cool-Font", sans-serif;
  font-size: 3vw;
}
.cool-font-xsm {
  font-family: "Cool-Font", sans-serif;
  font-size: 2vw;
  color: var(--squeal-yellow);
}

.cool-font-text {
  font-family: "Cool-Font", sans-serif;
  font-size: 2vw;
  color: var(--squeal-blue);
}
.cool-font-link {
  font-family: "Cool-Font", sans-serif;
  font-size: 2vw;
  color: var(--squeal-red);
}
.cool-font-details {
  font-family: "Cool-Font", sans-serif;
  font-size: 2vw;
  color: var(--squeal-green);
}

.cool-font-details-md {
  font-family: "Cool-Font", sans-serif;
  font-size: 5vw;
  color: var(--squeal-green);
}

.chill-font-xsm{
  font-family: "Chill-Font", sans-serif;
}
.chill-font-small{
  font-family: "Chill-Font", sans-serif;
}

.reg-font-xsm{
  font-family: "Regular-Font", sans-serif;
}
.reg-font-small{
  font-family: "Regular-Font", sans-serif;
}

@media screen and (max-width: 600px) {
  .cool-font-text,
  .cool-font-link,
  .cool-font-details {
    font-size: 4vw;
  }
}

@font-face {
  font-family: "Cool-Font";
  src: url("/media/ArchivoBlack-Regular.ttf");
}

@font-face {
  font-family: "Chill-Font";
  src: url("/media/Archivo-Bold.ttf");
}

@font-face {
  font-family: "Regular-Font";
  src: url("/media/Archivo-Regular.ttf")
}

.text-3d {
  font-family: "Cool-Font", sans-serif;
  font-size: 10vw;
  color: var(--squeal-yellow);

  text-shadow: 4px 4px 4px rgba(0, 0, 0, 0.8);

  transform: perspective(400px) rotateX(20deg);
}

/* -------------------- BUTTON STUFF ------------------*/
.custom-button {
  background-color: var(--squeal-blue);
  color: var(--squeal-yellow);
  border: none;
  border-radius: 8px;
  cursor: pointer;
}
.custom-button:hover {
  background-color: var(--squeal-green);
}

.custom-button-yellow {
  background-color: var(--squeal-yellow);
  color: var(--squeal-blue);
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}
.custom-button:hover {
  background-color: var(--squeal-green);
}

#buy-button,
#change-password,
#change-username {
  background-color: var(--squeal-green);
  color: var(--squeal-yellow);

  width: 20vw;
  padding: 1em;

  border: none;
  border-radius: 0.5rem;

  transition: background-color 0.3s, box-shadow 0.3s;
  cursor: pointer;
}

.upgrade-button {
  background-color: var(--squeal-pink);
  color: var(--squeal-yellow);

  width: 100%;
  padding: 1em;
  border: none;
  border-radius: 0.5rem;

  display: flex;
  justify-content: center;
  align-items: center;

  transition: background-color 0.3s, box-shadow 0.3s;
  cursor: pointer;
}

#delete-button,
#logout-button {
  background-color: var(--squeal-red);
  color: var(--squeal-yellow);

  width: 60vw;
  padding: 1em;

  border: none;
  border-color: var(--squeal-yellow);
  border-radius: 0.5rem;

  transition: background-color 0.3s, box-shadow 0.3s;
  cursor: pointer;
}

#delete-button:hover,
#logout-button:hover {
  background-color: var(--squeal-blue);
}

.red-button {
  background-color: var(--squeal-red);
  color: var(--squeal-yellow);
  width: 20vw;

  padding: 1em;
  border: none;

  border-radius: 0.5rem;
  cursor: pointer;
}
.blue-button {
  background-color: var(--squeal-blue);
  color: var(--squeal-yellow);
  width: 20vw;
  padding: 1em;
  border: none;

  border-radius: 0.5rem;
  cursor: pointer;
}
.yellow-button {
  background-color: var(--squeal-yellow);
  color: var(--squeal-blue);
  width: 20vw;

  padding: 1em;
  border: none;

  border-radius: 0.5rem;
  cursor: pointer;
}
.green-button {
  background-color: var(--squeal-green);
  color: var(--squeal-yellow);
  width: 20vw;

  padding: 1em;
  border: none;

  border-radius: 0.5rem;
  cursor: pointer;
}

.red-button:hover {
  background-color: var(--squeal-yellow);
}
.blue-button:hover {
  background-color: var(--squeal-green);
}
.yellow-button:hover {
  background-color: var(--squeal-blue);
}
.green-button:hover {
  background-color: var(--squeal-blue);
}
.green-button:active {
  background-color: var(--squeal-blue);
}
.reset-button {
  background-color: var(--squeal-red);
  color: var(--squeal-yellow);
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

/* -------------------- IMG STUFF ------------------*/
/* Stile predefinito*/
img {
  max-width: 100%; /* L'immagine si adatta alla larghezza del suo contenitore */
  height: auto; /* Altezza automatica per evitare distorsioni */
}

/* Stile per schermi md */
@media (max-width: 768px) {
  img {
    max-width: 30%; /* Riduci la larghezza dell'immagine al 80% del suo contenitore */
  }
}

/* Stile per schermi sm */
@media (max-width: 300px) {
  img {
    max-width: 70vw;
    max-height: 30vh; /* Riduci ulteriormente la larghezza dell'immagine al 60% del suo contenitore */
  }
}

/* -------------------- 3D EFFECT ------------------*/
.box {
  box-shadow: 0 0 10px rgba(0, 0, 0, 1);
}

/* -------------------- TOGGLE SMM------------------*/
.toggle-button {
  color: var(--squeal-blue);
  padding: 1em;
  margin: 1em;
  cursor: pointer;
  border: none;
  border-radius: 0.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: linear-gradient(to right, #528b57, #b45656);
  background-size: 200% 100%;
  transition: background-position 0.3s ease;
}

.toggle-button.toggled {
  background-position: -100% 0;
}

.toggle-button.toggled .slider {
  transform: translateX(100%);
}



</style>