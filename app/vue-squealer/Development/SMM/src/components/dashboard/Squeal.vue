<template>
  <div class="container-fluid mx-0 px-0">
    <div class="row">
      <Nav/>
    </div>
    <div class="row d-flex">
      <div class="col-2">
        <SideBar/>
      </div>
      <div class="col-9 justify-content-center pt-4">
        <div class="container-fluid justify-content-center">
          <div class="">
            <div class="chill-font-small">
              <h2><b>Quick Squeal</b></h2>
              <lord-icon
                  colors="primary:#e0bb76"
                  src="https://cdn.lordicon.com/ayhtotha.json"
                  style="width:50px;height:50px"
                  trigger="in">
              </lord-icon>
            </div>
            <div class="">
              <form>
                <div class="form-group">
                  <div class="container-sm d-flex flex-column">
                    <label class="col-form-label chill-font-small" for="recipient-name"
                    >Destinatari:
                    </label>
                    <input
                        id="dest"
                        v-model="inputDest"
                        aria-label="Destinatari"
                        class="form-control"
                        type="text"
                    />
                  </div>

                </div>

                <!--input type-->
                <div class="mb-3 mt-3 d-flex flex-column align-items-center">
                  <div class="tipsText">
                    <p v-if="viewTips !== ''">{{ viewTips }}</p>
                  </div>
                  <div class="btn-group p-2" role="group">
                    <button
                        aria-label="tipo di input testuale"
                        class="bottoni_omologati"
                        type="button"
                        @click="inputType = 'MESSAGE_TEXT'"
                        @mouseover="viewTips = 'message text'"
                    >
                      <i class="bi bi-pencil-fill inputIco"></i>
                    </button>
                    <button
                        aria-label="tipo di input immagine"
                        class="bottoni_omologati"
                        type="button"
                        @click="inputType = 'IMAGE'"
                        @mouseover="viewTips = 'image'"
                    >
                      <i class="bi bi-card-image inputIco"></i>
                    </button>
                    <button
                        aria-label="tipo di input video su you tube"
                        class="bottoni_omologati"
                        type="button"
                        @click="inputType = 'VIDEO_URL'"
                        @mouseover="viewTips = 'YouTube video'"
                    >
                      <i class="bi bi-youtube inputIco"></i>
                    </button>
                    <button
                        aria-label="tipo di input posizione"
                        class="bottoni_omologati"
                        type="button"
                        @click="inputType = 'POSITION'"
                        @mouseover="viewTips = 'any position'"
                    >
                      <i class="bi bi-globe-europe-africa inputIco"></i>
                    </button>
                    <button
                        aria-label="tipo di input messaggio temporizzato"
                        class="bottoni_omologati"
                        type="button"
                        @click="inputType = 'TEXT_AUTO'"
                        @mouseover="viewTips = 'timed message'"
                    >
                      <i class="bi bi-clock-history inputIco"></i>
                    </button>
                  </div>
                </div>

                <!--input form-->
                <div class="container form-group">
                  <div v-if="inputType === 'MESSAGE_TEXT'">
                    <label class="col-form-label chill-font-small" for="message-text"
                    >Scrivi qualcosa</label
                    >
                    <textarea
                        id="message-text"
                        v-model="inputContent"
                        aria-label="corpo del messaggio"
                        class="form-control"
                        name="message-text"
                    ></textarea>
                  </div>

                  <div v-else-if="inputType === 'IMAGE'">
                    <label for="message-image">Condividi qualcosa</label>
                    <br/>
                    <input
                        id="message-image"
                        accept="image/png, image/jpeg"
                        aria-label="selezione immagine"
                        class="col-form-label rounded"
                        name="message-image"
                        type="file"
                        @change="handelImage"
                    />
                  </div>

                  <div v-else-if="inputType === 'VIDEO_URL'" class="p-2">
                    <label class="col-form-label" for="message-video"
                    >Condividi un video su YouTube</label
                    >
                    <br/>
                    <input
                        id="message-video"
                        v-model="inputContent"
                        aria-label="link di youtube"
                        name="message-video"
                        type="url"
                    />
                  </div>

                  <div v-else-if="inputType === 'POSITION'">
                    <Map/>
                  </div>

                  <div v-else-if="inputType === 'TEXT_AUTO'">
                    <div>
                      <div class="d-flex flex-nowrap justify-content-between mb-1">
                        <label class="me-2" for="number1">
                          Quante ripetizioni?
                        </label>
                        <input
                            id="number1"
                            v-model="inputNumberRep"
                            aria-label="ripetizioni messaggio tepmorizzato"
                            class="border rounded"
                            min="1"
                            type="number"
                        />
                      </div>
                      <div class="d-flex flex-nowrap justify-content-between mb-1">
                        <label class="me-2" for="number2">
                          Ogni quanti secondi?
                        </label>
                        <input
                            id="number2"
                            v-model="inputSecRep"
                            aria-label="ritardo in secondi da una ripetizione all'altra "
                            class="border rounded"
                            min="1"
                            type="number"/>
                      </div>
                      <textarea
                          v-model="inputContent"
                          aria-label="corpo del messaggio temporizzato"
                          class="container border rounded"
                          placeholder="Inserisci il testo del post..."
                      ></textarea>
                    </div>
                  </div>
                </div>
              </form>
              <div class="">
                <button aria-label="invia messaggio" class="btn grn-btn-lite mt-3" type="button" @click="postSqueal">
                  Post from <b>{{ vipName }}</b>
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
import VueConfig from "@/config/VueConfig";
import {defineComponent, onMounted, onUpdated, ref, watch} from "vue";
import {store} from "@/store";
import Map from "@/components/dashboard/Map.vue";
import {useToast} from "vue-toastification";
import {useRoute} from "vue-router"
import Nav from "@/components/Nav.vue";
import SideBar from "@/components/dashboard/SideBar.vue";

const toast = useToast()
const route = useRoute();

function showToast(type) {
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
    toast.success("Squeal posted", options);
  else if (type === 'warning')
    toast.warning("Ops! Something went wrong", options);
}

const components = defineComponent({
  Map,
});
const props = defineProps({
  vip: String,
});
const vipName = ref(route.params.vip);
const viewTips = ref("message text");
const inputType = ref("MESSAGE_TEXT");
const inputDest = ref([]);
const inputContent = ref("");
const inputNumberRep = ref(1);
const inputSecRep = ref(0);

watch(vipName, () => {
  vipName.value = route.params.vip;
})

onMounted(() => {
  vipName.value = route.params.vip;
})

onUpdated(() => {
  vipName.value = route.params.vip;
})

/*check dei destinatari*/
function checkDest() {
  // Suddivide l'input in destinatari separati da virgole
  const destSep = inputDest.value
      .toString()
      .split(",")
      .map((dest) => dest.trim());
  const isValid = destSep.every((dest) => /^[@#§]/.test(dest));
  if (!isValid) {
    alert("Ogni destinatario deve iniziare con uno dei simboli: #, §, @");
    return null;
  }

  return destSep;
}

const inputImg = ref(null);

function handelImage() {
  const file = document.querySelector("input[type=file]").files[0];
  const reader = new FileReader();

  reader.onloadend = () => {
    inputImg.value = reader.result;
  };
  reader.readAsDataURL(file);
}

function checkVideo() {
  const regex =
      /^(https?:\/\/)?(www\.)?(youtube\.com\/(channel\/|user\/|c\/)?[a-zA-Z0-9_-]{1,})|(youtu\.be\/[a-zA-Z0-9_-]{1,})/;
  return regex.test(inputContent.value);
}

// create the request body
function assembleContent() {
  let body = "";
  switch (inputType.value) {
    case "MESSAGE_TEXT":
      if (inputContent.value.length > 0) body = inputContent.value;
      else body = null;
      break;
    case "IMAGE":
      if (inputImg != null) body = inputImg.value;
      else body = null;
      break;
    case "VIDEO_URL":
      if (checkVideo()) body = inputContent.value;
      else body = null;
      break;
    case "POSITION":
      if (
          store.getters.getSInCoor[0] != null &&
          store.getters.getSInCoor[1] != null
      )
        body = [
          store.getters.getSInCoor[0],
          store.getters.getSInCoor[1],
        ];
      else body = null;
      break;
    case "TEXT_AUTO":
      if (inputContent.value.length > 0 && inputNumberRep.value > 0 && inputSecRep.value > 0)
        body = inputContent.value;
      break;
  }
  return body;
}

// validation and fetch of the squeal
function postSqueal() {
  const uri = VueConfig.base_url_requests + "/squeal/from-smm/" + vipName.value;
  const destination = checkDest();
  if (destination == null)
    return;
  const squealContent = assembleContent();
  if (squealContent == null)
    return;
  let squealBody = {
    squeal: {
      destinations: destination,
      sender: vipName.value,
      message_type: inputType.value,
      content: squealContent
    }
  }
  if (inputType.value === 'TEXT_AUTO') {
    squealBody.squeal.auto_iterations = inputNumberRep.value;
    squealBody.squeal.auto_seconds_delay = inputSecRep.value;
  }
  const options = {
    method: 'POST',
    credentials: 'include',
    mode: 'cors',
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(squealBody)
  }
  fetch(uri, options)
      .then((res) => {
        if (res.ok) {
          showToast('success');
        } else {
          console.error("Error during post");
          showToast('warning');
        }
      })
      .catch((error) => {
        showToast('warning')
        console.error('Network error', error)
      });
}
</script>

<style>

.bottoni_omologati {
  width: 3em;
  min-height: 3em;
  border-radius: 50%;
}

.inputIco {
  width: 16px;
  height: 16px;
}

.tipsText {
  color: rgb(255, 255, 255);
}

#closeBtn {
  background-color: #ff1500;
}
</style>