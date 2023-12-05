<template>
  <div class="container-fluid mx-0 px-0">
    <div class="row">
      <Nav/>
    </div>
    <div class="row d-flex">
      <div class="col-2">
        <SideBar/>
      </div>

      <div class="col-10 pt-sm-5 pt-3">
        <h1>Situazione quota di  <b>{{ VipName }}</b></h1>
        <button
            id="greenButton"
            class="btn"
            @click="getQuoteInfo">
          <i class="bi bi-arrow-clockwise"></i>
          Refresh
        </button>

        <div class="card mt-3">
          <div class="card-body">
            <h4>Daily quote remaining: <b>{{ quote.rem_daily }}</b></h4>
            <h4>Weekly quote remaining: <b>{{ quote.rem_weekly }}</b></h4>
            <h4>Monthly quote remaining: <b>{{ quote.rem_monthly }}</b></h4>
          </div>
        </div>

        <div class="card mt-3">
          <div class="card-body">
            <h4>Daily quote limit: <b>{{ quote.limit_daily }}</b></h4>
            <h4>Weekly quote limit: <b>{{ quote.limit_weekly }}</b></h4>
            <h4>Monthly quote limit: <b>{{ quote.limit_monthly }}</b></h4>
          </div>
        </div>


        <button class="btn bg-warning mt-3" @mouseover="isMouseOver=true" @mouseleave="isMouseOver=false"
                @click="openModal">
          <i v-if="!isMouseOver" class="bi bi-lightning"></i>
          <i v-if="isMouseOver" class="bi bi-lightning-fill"></i>
          Quick Refill
        </button>

        <div class="modal fade" id="quickRefill" tabindex="-1" aria-hidden="true">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h3 class="modal-title"><b>Quick Refill</b></h3>
                <h6><i>you cannot remain mute for lack of characters...</i></h6>
                <lord-icon
                    src="https://cdn.lordicon.com/sbrtyqxj.json"
                    trigger="loop"
                    delay="2000"
                    colors="primary:#e0bb76"
                    style="width:50px;height:50px;">
                </lord-icon>
              </div>
              <div class="modal-body">
                <h3>Riempimento istantanea di quota:  {{quote.limit_daily - quote.rem_daily}}</h3>
                <h5>prezzo: </h5>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-danger" id="close" @click="closeModal">
                  Close
                </button>
                <button type="button" class="btn" id="submit" @click="refillQuote">
                  Confirm
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
import {onMounted, onUpdated, reactive, watch} from "vue";
import {ref} from "vue";

const route = useRoute();
const VipName = ref('');
const isMouseOver = ref(false);
const state = reactive({
  modal_demo: null,
});

onMounted(() => {
  VipName.value = route.params.vip;
  getQuoteInfo();
  state.modal_demo = new bootstrap.Modal(
      document.getElementById("quickRefill"),
      {},
  );
})

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
  console.log(uri);
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
          return res.json();
        }
        console.error("Error refill quote");
      })
      .catch((error) => {
        console.error("Network error", error)
      })
}
</script>

<style>
.modal{
  color:  #e0bb76;
}
</style>