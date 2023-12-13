<template>
  <div class="container">
    <div class="d-flex justify-content-around">
      <div class="d-flex align-items-center">
        <button class="btn nav-button" @click="prevSqueal">
          <i class="bi bi-caret-left-fill"></i>
        </button>
      </div>

      <div class="card box squeal chill-font-xsm" style="width: 18rem;">
        <div class="card-header"><h5>Squeal del {{ actualSqueal.date }}</h5></div>
        <div class="card-body">
          <div v-if="actualSqueal.type === 'MESSAGE_TEXT'"><p
              class="card-text border rounded border-dark p-1 bg-white reg-font-xsm" style="text-align: start; color: #282c34"> {{ actualSqueal.content }}
          </p></div>

          <div v-else-if="actualSqueal.type === 'IMAGE'"><img
              :src="'data:image/jpeg;base64,' + actualSqueal.content" alt="squeal image" class="border rounded border-dark box">
          </div>

          <div v-else-if="actualSqueal.type === 'VIDEO_URL'">
            <div class="row">
              <iframe :src=" '//www.youtube.com/embed/' + fixYTUrl(actualSqueal.content)"
                      allow="accelerometer; autoplay; web-share" allowfullscreen
                      class="col-lg-12 col-md-12 col-sm-12 box bg-dark"
                      title="YouTube video player"></iframe>
            </div>
          </div>

          <div v-else-if="actualSqueal.type === 'POSITION'">
            <div id="map"></div>

          </div>

        </div>
        <div class="card-footer text-muted chill-font-xsm" style="text-align: start">
          costo: {{ actualSqueal.cost }}
        </div>
      </div>
      <div class="card box squeal" style="width: 18rem">
        <div class="card-body">
          <Doughnut
              ref="chart"
              :data="chartData"
              :options="chartOptions"/>
        </div>
      </div>

      <div class="d-flex align-items-center">
        <button class="btn nav-button" @click="nextSqueal">
          <i class="bi bi-caret-right-fill"></i>
        </button>
      </div>

    </div>
  </div>
</template>

<script setup>
import {onMounted, onUpdated, ref, watch} from "vue";
import {Chart as ChartJS, ArcElement, Tooltip, Legend} from 'chart.js'
import {Doughnut} from "vue-chartjs";
import {useStore} from "vuex";
import L from "leaflet"

const store = useStore();
ChartJS.register(ArcElement, Tooltip, Legend);

const actualSqueal = ref({});
const index = ref(0);
const loaded = ref(false);
const chartData = ref( {
  labels: ['pos', 'neg'],
  datasets: [{
    backgroundColor: ['#498bff', '#de2525'],
    data: [store.getters.getDoughnutChart[index.value].positive_value,
      store.getters.getDoughnutChart[index.value].negative_value],
  }]
});

watch(index, ()=>{
  chartData.value = {
    labels: ['pos', 'neg'],
    datasets: [{
      backgroundColor: ['#498bff', '#de2525'],
      data: [store.getters.getDoughnutChart[index.value].positive_value,
        store.getters.getDoughnutChart[index.value].negative_value],
    }],
  };
})

function assebleSqueal() {
  loaded.value = false;
  const squealDate = new Date(store.getters.getDoughnutChart[index.value].date * 1000);
  actualSqueal.value = {
    date: squealDate.getDate() + '/' + (squealDate.getMonth() + 1) + '/' + squealDate.getFullYear(),
    content: store.getters.getDoughnutChart[index.value].content,
    cost: store.getters.getDoughnutChart[index.value].quote_cost,
    type: store.getters.getDoughnutChart[index.value].message_type,
  }
  if(store.getters.getDoughnutChart[index.value].message_type === 'POSITION'){
    let coordinates = (store.getters.getDoughnutChart[index.value].content).split(',');
    let lat = coordinates[0];
    let lng = coordinates[1];
    actualSqueal.value.lat = lat;
    actualSqueal.value.lng = lng;
  }
  loaded.value = true;
}

function nextSqueal() {
  if (index.value < store.getters.getDoughnutChart.length - 1) {
    index.value = index.value + 1;
    console.log(index.value)
    assebleSqueal();
  }
}

function prevSqueal() {
  if (index.value > 0) {
    index.value = index.value - 1;
    console.log(index.value)
    assebleSqueal();
  }
}

function fixYTUrl(url) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);

  if (match && match[2].length === 11) {
    return match[2];
  } else {
    return 'error';
  }
}

function initMap(lat,lng){
  const map = L.map("map",{
    center: L.latLng(lat,lng),
    zoom: 14,
  });
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap",
  }).addTo(map)

  L.marker([lat, lng]).addTo(map)
}

//e quiiii aspettiamo le funzioni di Denis

const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: false
})

onMounted(() => {
  index.value = 0;
  console.log('i ' + index.value)
  assebleSqueal()
})

onUpdated(()=>{
  if(actualSqueal.value.type === 'POSITION'){
    initMap(actualSqueal.value.lat, actualSqueal.value.lng);
  }

})


</script>

<style>
  @import "leaflet/dist/leaflet.css";
  .nav-button{
    border-radius: 50%;
    height: fit-content;
    background-color: #528b57;
  }
</style>
