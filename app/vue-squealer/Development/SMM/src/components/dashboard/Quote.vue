<template>
  <div class="container-fluid mx-0 px-0">
    <div class="row">
      <Nav/>
    </div>
    <div class="row d-flex">
      <div class="col-2">
        <SideBar/>
      </div>

      <div class="col-10 pt-sm-5 pt-3 cool-font-xsm ">
        <h1><span style="color: #C94646FF">S</span>ituazione quota di <u>{{ VipName }}</u></h1>
        <button
            id="greenButton"
            aria-label="Aggiorna la quota dell'utente"
            class="btn green-button m-4 p-3"
            @click="getQuoteInfo"
        >
          <i class="bi bi-arrow-clockwise"></i>
          <span class="d-none d-lg-inline">Refresh</span>
        </button>

        <div class="card bg-dark mt-3 m-5 d-flex justify-content-center align-items-center box">
          <div class="card-body">
            <h4>Daily quote remaining: <u>{{ quote.rem_daily }}</u></h4>
            <h4>Weekly quote remaining: <u>{{ quote.rem_weekly }}</u></h4>
            <h4>Monthly quote remaining: <u>{{ quote.rem_monthly }}</u></h4>
          </div>
        </div>

        <div class="card bg-dark mt-3 m-5 d-flex justify-content-center align-items-center box">
          <div class="card-body">
            <h4>Daily quote limit: <u>{{ quote.limit_daily }}</u></h4>
            <h4>Weekly quote limit: <u>{{ quote.limit_weekly }}</u></h4>
            <h4>Monthly quote limit: <u>{{ quote.limit_monthly }}</u></h4>
          </div>
        </div>


        <button aria-label="ricarica istantanea della quota giornaliera" class="btn yellow-button" @click="openModal"
                @mouseleave="isMouseOver=false"
                @mouseover="isMouseOver=true">
          <i v-if="!isMouseOver" class="bi bi-lightning"></i>
          <i v-if="isMouseOver" class="bi bi-lightning-fill"></i>
          Quick Refill
        </button>

        <div id="quickRefill" aria-hidden="true" class="modal fade" tabindex="-1">
          <div class="modal-dialog ">
            <div class="modal-content bg-dark">
              <div class="modal-header">
                <h3 class="modal-title"><b>Quick Refill</b></h3>
                <h6><i>non si può rimanere muti per mancanza di caratteri</i></h6>
                <lord-icon
                    colors="primary:#e0bb76"
                    delay="2000"
                    src="https://cdn.lordicon.com/sbrtyqxj.json"
                    style="width:50px;height:50px;"
                    trigger="loop">
                </lord-icon>
              </div>
              <div class="modal-body">
                <h3>Riempimento istantanea di quota: {{ quote.limit_daily - quote.rem_daily }}</h3>
                <h5>prezzo: € {{ (quote.limit_daily - quote.rem_daily) * 0.03 }} </h5>
              </div>
              <div class="modal-footer">
                <button id="close" aria-label="chiudi" class="btn red-button w-25" type="button" @click="closeModal">
                  <span>Close</span>
                </button>
                <button id="submit" aria-label="ricarica" class="btn green-button w-25" type="button"
                        @click="refillQuote">
                  <span class="m-1">Refill</span>
                </button>

              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  </div>
</template>

<script setup>
import Nav from "@/components/Nav.vue";
import SideBar from "@/components/dashboard/SideBar.vue";
import VueConfig from "@/config/VueConfig";
import {useRoute} from 'vue-router'
import {onMounted, onUpdated, reactive, ref, watch} from "vue";
import {useToast} from "vue-toastification";

const route = useRoute();
const VipName = ref('');
const isMouseOver = ref(false);
const state = reactive({
  modal_demo: null,
});
const toast = useToast();

onMounted(() => {
  VipName.value = route.params.vip;
  getQuoteInfo();
  state.modal_demo = new bootstrap.Modal(
      document.getElementById("quickRefill"),
      {},
  );
})

function showToast(type, msg) {
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
}

function openModal() {
  state.modal_demo.show();
}

function closeModal() {
  state.modal_demo.hide();
}

onUpdated(() => {
  VipName.value = route.params.vip;
})

watch(VipName, () => {
  getQuoteInfo();
})

let quote = ref({});

async function getQuoteInfo() {
  const uri = VueConfig.base_url_requests +
      '/user/' +
      VipName.value +
      '/quote';
  fetch(uri, {
    method: 'GET',
    credentials: 'include',
    mode: 'cors'
  })
      .then((res) => {
        if (res.ok)
          return res.json();
        console.error("Error fetching quote data");
      })
      .then((data) => {
        quote.value = {
          limit_daily: data.limit_daily,
          limit_weekly: data.limit_weekly,
          limit_monthly: data.limit_monthly,
          rem_daily: data.remaining_daily,
          rem_weekly: data.remaining_weekly,
          rem_monthly: data.remaining_monthly
        }
      })
      .catch((error) => {
        console.error("Network error", error);
      })
}

async function refillQuote() {
  const uri = VueConfig.base_url_requests +
      '/user/' +
      VipName.value +
      '/quote/refill/';
  fetch(uri, {
    method: 'PUT',
    credentials: 'include',
    mode: 'cors',
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  })
      .then((res) => {
        if (res.ok) {
          showToast('success', "Quote Refilled")
          return res.json();
        }
        showToast('warning', "Ops, qualcosa è andato storto")
        console.error("Error refill quote");
      })
      .catch((error) => {
        console.error("Network error", error)
      })
}
</script>

<style>
.modal {
  color: #e0bb76;
}
</style>