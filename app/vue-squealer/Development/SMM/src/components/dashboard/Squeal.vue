<template>
  <button id="squealButton" class="btn" type="button" @click="openModal">
    <i class="bi bi-send-plus"></i>
    <span class="d-none d-lg-inline">Quick Squeal</span>
  </button>

  <div id="quickSqueal" aria-hidden="true" class="modal fade" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h3 class="modal-title"><b>Quick Squeal</b></h3>
          <h6>Quote available:</h6>
        </div>
        <div class="modal-body">
          <form>
            <div class="form-group">
              <label class="col-form-label" for="recipient-name"
                >Destinatari:</label
              >
              <input
                id="dest"
                v-model="inputDest"
                class="form-control"
                type="text"
              />
            </div>

            <!--input type-->
            <div class="mb-3 mt-3 d-flex flex-column align-items-center">
              <div class="tipsText">
                <p v-if="viewTips !== ''">{{ viewTips }}</p>
              </div>
              <div class="btn-group p-2" role="group">
                <button
                  class="bottoni_omologati"
                  type="button"
                  @click="inputType = 'MESSAGE_TEXT'"
                  @mouseover="viewTips = 'message text'"
                >
                  <i class="bi bi-pencil-fill inputIco"></i>
                </button>
                <button
                  class="bottoni_omologati"
                  type="button"
                  @click="inputType = 'IMAGE'"
                  @mouseover="viewTips = 'image'"
                >
                  <i class="bi bi-card-image inputIco"></i>
                </button>
                <button
                  class="bottoni_omologati"
                  type="button"
                  @click="inputType = 'VIDEO_URL'"
                  @mouseover="viewTips = 'YouTube video'"
                >
                  <i class="bi bi-youtube inputIco"></i>
                </button>
                <button
                  class="bottoni_omologati"
                  type="button"
                  @click="inputType = 'POSITION'"
                  @mouseover="viewTips = 'any position'"
                >
                  <i class="bi bi-globe-europe-africa inputIco"></i>
                </button>
                <button
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
            <div class="form-group">
              <div v-if="inputType === 'MESSAGE_TEXT'">
                <label class="col-form-label" for="message-text"
                  >Write something</label
                >
                <textarea
                  id="message-text"
                  v-model="inputContent"
                  class="form-control"
                  name="message-text"
                ></textarea>
              </div>

              <div v-else-if="inputType === 'IMAGE'">
                <label for="message-image">Share a image</label>
                <br />
                <input
                  id="message-image"
                  accept="image/png, image/jpeg"
                  class="col-form-label"
                  name="message-image"
                  type="file"
                  @change="handelImage"
                />
              </div>

              <div v-else-if="inputType === 'VIDEO_URL'" class="p-2">
                <label class="col-form-label" for="message-video"
                  >Share a YouTube video</label
                >
                <br />
                <input
                  id="message-video"
                  v-model="inputContent"
                  name="message-video"
                  type="url"
                />
              </div>

              <div v-else-if="inputType === 'POSITION'">
                <Map />
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
                      class=""
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
                        type="number"
                        min="1"/>
                  </div>
                  <textarea
                    class="container"
                    placeholder="Inserisci il testo del post..."
                    v-model="inputContent"
                  ></textarea>
                </div>
              </div>
            </div>
          </form>
          <div class="modal-footer">
            <button
              id="closeBtn"
              class="btn btn-secondary"
              type="button"
              @click="closeModal"
            >
              Close
            </button>
            <button class="btn btn-primary" type="button" @click="postSqueal">
              Post from {{ vipName }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import VueConfig from "@/config/VueConfig";
import { reactive, onMounted, defineComponent } from "vue";
import { ref } from "vue";
import { store } from "@/store";
import Map from "@/components/dashboard/Map.vue";
import {useToast} from "vue-toastification";

const toast = useToast()
function showToast(type){
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
  if(type === 'success')
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
const vipName = ref("");
const viewTips = ref("message text");
const state = reactive({
  modal_demo: null,
});
const inputType = ref("MESSAGE_TEXT");
const inputDest = ref([]);
const inputContent = ref("");
const inputNumberRep = ref(1);
const inputSecRep = ref(0);

onMounted(() => {
  vipName.value = props.vip;
  state.modal_demo = new bootstrap.Modal(
    document.getElementById("quickSqueal"),
    {},
  );
});

/*modal functions*/
function openModal() {
  state.modal_demo.show();
}

function closeModal() {
  state.modal_demo.hide();
}

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
        body = String([
          store.getters.getSInCoor[0],
          store.getters.getSInCoor[1],
        ]);
      else body = null;
      break;
    case "TEXT_AUTO":
      if(inputContent.value.length > 0 && inputNumberRep > 0 && inputSecRep > 0)
        body = inputContent.value;
      break;
  }
  console.log(body);
  return body;
}

// validation and fetch of the squeal
function postSqueal() {
  console.log("from:" + vipName.value)
  const uri = VueConfig.base_url_requests + "/squeal/from-smm/" + vipName.value;
  const destination = checkDest();
    if(destination == null)
      return;
  const squealContent = assembleContent();
    if(squealContent == null)
      return;
  let squealBody = {
    squeal: {
      destination: destination,
      sender: vipName.value,
      message_type: inputType.value,
      content: squealContent
    }
  }
  if(inputType.value === 'TEXT_AUTO'){
    squealBody.auto_iterations = inputNumberRep;
    squealBody.auto_seconds_delay = inputSecRep;
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
  console.log(JSON.stringify(squealBody))
  fetch(uri, options)
      .then((res)=>{
        if(res.ok){
          showToast('success');
        } else {
          console.error("Error during post");
          showToast('warning');
        }
      })
      .catch((error)=>{
        console.error('Network error', error)
      });
}
</script>

<style>
.modal-title {
  color: #e0bb76;
}

.btn {
  background-color: #528b57;
}

.modal-content {
  background-color: #072f38;
}

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
