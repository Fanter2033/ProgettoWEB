<template>
  <div class="container mb-5">

    <div class="d-flex flex-column flex-lg-row justify-content-around">

      <div class="d-flex align-items-center">
        <button aria-label="Squeal precedente" class="btn nav-button" @click="prevSqueal">
          <i class="bi bi-caret-left-fill"></i>
        </button>
      </div>

      <div class="card box squeal chill-font-xsm mb-3 mb-lg-0" style="width: 19rem;">
        <div class="card-header">
          <div class="d-flex justify-content-between flex-nowrap">
            <div style="text-align: start">
              <h5>Squeal del {{ actualSqueal.date }}</h5>
              <p style="font-size: small">Desinazioni: <span style="color: #072f38"> {{ actualSqueal.dest }} </span></p>
            </div>
            <div class="flex-nowrap" style="color: var(--squeal-blue)">
              <i class="bi bi-eye me-1"></i>
              <span> {{ actualSqueal.views }} </span>
            </div>
          </div>
        </div>
        <div class="card-body">
          <div v-if="actualSqueal.type === 'MESSAGE_TEXT' || actualSqueal.type === 'TEXT_AUTO'"><p
              class="card-text border rounded border-dark p-1 bg-white reg-font-xsm"
              style="text-align: start; color: #282c34"> {{ actualSqueal.content }}
          </p></div>

          <div v-else-if="actualSqueal.type === 'IMAGE'"><img
              :src="'data:image/jpeg;base64,' + actualSqueal.content" alt="squeal image"
              class="img-fluid border rounded border-dark box">
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
        <div class="card-footer text-muted reg-font-xsm d-flex justify-content-between align-items-center"
             style="text-align: start">
          <div>
            costo: {{ actualSqueal.cost }}
          </div>
          <div>
            <!--change view button-->
            <button aria-label="cambia visualizzazione da commenti a grafici" class="btn align-items-center border rounded border-dark"
                    @click="switchView">
              <i v-if="!showComments" class="bi bi-chat-text"></i>
              <i v-else-if="showComments" class="bi bi-pie-chart"></i>
            </button>
          </div>
          <div>
            {{ index + 1 }} di {{ listLength }}
          </div>
        </div>
      </div>

      <div class="card box squeal  d-lg-inline" style="width: 18rem">
        <div class="card-body">
          <div v-if="!showComments" class="card-title"><h3 class="chill-font-small">Statistiche</h3></div>
          <div v-if="!showComments">
            <Doughnut
                ref="chart"
                :data="chartData"
                :options="chartOptions"/>

          </div>
          <div v-else-if="showComments" class="overflow-auto">
            <h3 class="chill-font-small">Commenti</h3>
            <div v-for="comment in commentsToPrint" class="rounded">
              <p><b>{{ comment.username }}</b> - {{ comment.comment }}</p>
            </div>
          </div>
        </div>
        <div class="card-footer">
          <div v-if="!showComments">
            <!--end of squeal body-->
            <div class="mt-2">
              <div v-if="actualSqueal.trend !== 'Nothing'">
                <button v-if="actualSqueal.trend === 'Popular'" class="btn grn-btn-lite"> {{ actualSqueal.trend }}
                </button>
                <button v-else-if="actualSqueal.trend === 'Unpopular'" class="btn red-btn-lite">
                  {{ actualSqueal.trend }}
                </button>
                <button v-else class="btn blue-btn-lite"> {{ actualSqueal.trend }}</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="d-flex align-items-center">
        <button aria-label="Squeal successivo" class="btn nav-button" @click="nextSqueal">
          <i class="bi bi-caret-right-fill"></i>
        </button>
      </div>

    </div>
  </div>
</template>

<script setup>
import {onBeforeMount, onUpdated, ref, watch} from "vue";
import {ArcElement, Chart as ChartJS, Legend, Tooltip} from 'chart.js'
import {Doughnut} from "vue-chartjs";
import {useStore} from "vuex";
import L from "leaflet"
import VueConfig from "@/config/VueConfig";

const store = useStore();
ChartJS.register(ArcElement, Tooltip, Legend);

const actualSqueal = ref({});
const actualFetched = ref({});
const actualComments = ref({});
const showComments = ref(false);
const commentsToPrint = ref([]);
const index = ref(0);
const listLength = ref(store.getters.getDoughnutChart.length)
const loaded = ref(false);
const chartData = ref({
  labels: ['pos', 'neg'],
  datasets: [{
    backgroundColor: ['#498bff', '#de2525'],
    data: [actualFetched.value.positive_value,
      actualFetched.value.negative_value],
  }]
});

const iconOptions = {
  iconUrl: "/media/MapMarker.png",
  iconSize: [50, 50],
  shadowSize: [25, 75],
};

watch(actualFetched, () => {
  chartData.value = {
    labels: ['pos', 'neg'],
    datasets: [{
      backgroundColor: ['#498bff', '#de2525'],
      data: [actualFetched.value.positive_value,
        actualFetched.value.negative_value],
    }],
  };
})

//fetch the squeal given the id
async function getSquealData(id) {
  const uri = VueConfig.base_url_requests +
      "/squeal/" + id;
  await fetch(uri, {
    method: 'GET',
    mode: 'cors',
    credentials: 'include'
  })
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          console.error("Error fetching squeal");
        }
      }).then((data) => {
        actualFetched.value = data;
      })
      .catch((error) => {
        console.error("Network error", error);
      })
}

//get the comments
async function getSquealComments(id) {
  const uri = VueConfig.base_url_requests +
      "/squeal/" + id + "/comment/";
  actualComments.value = {};
  await fetch(uri, {
    method: 'GET',
    mode: 'cors',
    credentials: 'include'
  })
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          console.error("Error fetching squeal");
        }
      }).then((data) => {
        actualComments.value = data;
      })
      .catch((error) => {
        console.error("Network error", error);
      })
}


function assebleSqueal(squealFromServer) {
  const squealDate = new Date(squealFromServer.date * 1000);
  actualSqueal.value = {
    date: squealDate.getDate() + '/' + (squealDate.getMonth() + 1) + '/' + squealDate.getFullYear(),
    content: squealFromServer.content,
    cost: squealFromServer.quote_cost,
    type: squealFromServer.message_type,
    dest: squealFromServer.destinations,
    views: squealFromServer.critical_mass / 0.25
  }
  if (squealFromServer.message_type === 'POSITION') {
    let coorFromSqueal = squealFromServer.content;
    let coordinates = String(coorFromSqueal).split(',');
    let lat = coordinates[0];
    let lng = coordinates[1];
    actualSqueal.value.lat = lat;
    actualSqueal.value.lng = lng;
  }
  //popular, unpopular, controversial
  if (squealFromServer.critical_mass < squealFromServer.positive_value
      && squealFromServer.critical_mass < squealFromServer.negative_value)
    actualSqueal.value.trend = 'Controversial'
  else if (squealFromServer.critical_mass < squealFromServer.positive_value)
    actualSqueal.value.trend = 'Popular'
  else if (squealFromServer.critical_mass < squealFromServer.negative_value)
    actualSqueal.value.trend = 'Unpopular'
  else
    actualSqueal.value.trend = 'Nothing'
}



function assebleComments(commentsFromServer) {
  commentsToPrint.value = [];
  for (let i = 0; i < commentsFromServer.length; i++) {
    let iter = {
      username: commentsFromServer[i].username,
      comment: commentsFromServer[i].comment,
    }
    commentsToPrint.value.push(iter);
  }
}


function switchView() {
  if (showComments.value === false) {
    assebleComments(actualComments.value)
  }
  showComments.value = !showComments.value;
}

//navigate
async function nextSqueal() {
  if (index.value < store.getters.getDoughnutChart.length - 1) {
    try {
      map.remove();
    } catch (e) {
    }
    index.value = index.value + 1;
    showComments.value = false;
    await getSquealData(store.getters.getDoughnutChart[index.value]);
    await getSquealComments(store.getters.getDoughnutChart[index.value])
    assebleSqueal(actualFetched.value);
  }
}

async function prevSqueal() {
  if (index.value > 0) {
    index.value = index.value - 1;
    showComments.value = false;
    await getSquealData(store.getters.getDoughnutChart[index.value]);
    await getSquealComments(store.getters.getDoughnutChart[index.value])
    assebleSqueal(actualFetched.value);
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

//build the map for the position's squeal
function initMap(lat, lng) {
  try {
    const map = L.map("map", {
      center: L.latLng(lat, lng),
      zoom: 14,
    });
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap",
    }).addTo(map);
    let customIcon = L.icon(iconOptions);
    L.marker([lat, lng], {icon: customIcon}).addTo(map);
  } catch (e) {
  }

}


const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: false
})

onBeforeMount(async () => {
  index.value = 0;
  await getSquealData(store.getters.getDoughnutChart[index.value]);
  await getSquealComments(store.getters.getDoughnutChart[index.value])
  assebleSqueal(actualFetched.value);
})

onUpdated(() => {
  if (actualSqueal.value.type === 'POSITION') {
    initMap(actualSqueal.value.lat, actualSqueal.value.lng);
  }
})


</script>

<style>
@import "leaflet/dist/leaflet.css";

.nav-button {
  border-radius: 50%;
  height: fit-content;
  background-color: #528b57;
}
</style>
