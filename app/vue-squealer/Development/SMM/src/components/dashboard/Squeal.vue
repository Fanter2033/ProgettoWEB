<template>
  <button type="button" id="squealButton" class="btn" @click="openModal">
    <i class="bi bi-send-plus"></i>
    <span class="d-none d-lg-inline">Quick Squeal</span>
  </button>

  <div class="modal fade" id="quickSqueal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h3 class="modal-title"><b>Quick Squeal</b></h3>
          <h6>Quote available:</h6>
        </div>
        <div class="modal-body">
          <form>
            <div class="form-group">
              <label for="recipient-name" class="col-form-label"
                >Destinatari:</label
              >
              <input type="text" class="form-control" id="dest" v-model="inputDest" />
            </div>

            <!--input type-->
            <div class="mb-3 mt-3 d-flex flex-column align-items-center">
              <div class="tipsText">
                <p v-if="viewTips !== ''">{{ viewTips }}</p>
              </div>
              <div class="btn-group p-2" role="group">
                <button
                  type="button"
                  class="bottoni_omologati"
                  @click="inputType = 'MESSAGE_TEXT'"
                  @mouseover="viewTips = 'message text'"
                >
                  <i class="bi bi-pencil-fill inputIco"></i>
                </button>
                <button
                  type="button"
                  class="bottoni_omologati"
                  @click="inputType = 'IMAGE'"
                  @mouseover="viewTips = 'image'"
                >
                  <i class="bi bi-card-image inputIco"></i>
                </button>
                <button
                  type="button"
                  class="bottoni_omologati"
                  @click="inputType = 'VIDEO_URL'"
                  @mouseover="viewTips = 'YouTube video'"
                >
                  <i class="bi bi-youtube inputIco"></i>
                </button>
                <button
                  type="button"
                  class="bottoni_omologati"
                  @click="inputType = 'POSITION'"
                  @mouseover="viewTips = 'any position'"
                >
                  <i class="bi bi-globe-europe-africa inputIco"></i>
                </button>
                <button
                  type="button"
                  class="bottoni_omologati"
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
                <label for="message-text" class="col-form-label"
                  >Write something</label
                >
                <textarea
                  class="form-control"
                  id="message-text"
                  name="message-text"
                  v-model="inputContent"
                ></textarea>
              </div>

              <div v-else-if="inputType === 'IMAGE'">
                <label for="message-image">Share a image</label>
                <br />
                <input
                  type="file"
                  id="message-image"
                  name="message-image"
                  accept="image/png, image/jpeg"
                  class="col-form-label"
                  @change="handelImage"
                />
              </div>

              <div v-else-if="inputType === 'VIDEO_URL'" class="p-2">
                <label for="message-video" class="col-form-label"
                  >Share a YouTube video</label
                >
                <br />
                <input type="url" id="message-video" name="message-video"
                v-model="inputContent"/>
              </div>

              <div v-else-if="inputType === 'POSITION'">
                <Map/>
              </div>

              <div v-else-if="inputType === 'TEXT_AUTO'">
                <h3>
                  WORK IN PROGRESS...
                  <img
                    src="../../../public/media/k.gif"
                    alt="work in progress"
                    style="width: 50px"
                  />
                </h3>
              </div>
            </div>
          </form>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              id="closeBtn"
              @click="closeModal"
            >
              Close
            </button>
            <button type="button" class="btn btn-primary" @click="postSqueal">
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
import {reactive, onMounted, watch, defineComponent} from "vue";
import { ref } from "vue";
import Map from "@/components/dashboard/Map.vue";

const components = defineComponent({
  Map
})
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
const reader = new FileReader();



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
  const destSep = inputDest.value.toString()
      .split(",")
      .map((dest) => dest.trim());
  const isValid = destSep.every((dest) =>
      /^[@#§]/.test(dest)
  );
  if (!isValid) {
    alert("Ogni destinatario deve iniziare con uno dei simboli: #, §, @");
    return null;
  }
  return destSep;
}

const inputImg = ref(null);
function handelImage(){
  const file = document.querySelector('input[type=file]').files[0]
  const reader = new FileReader()

  reader.onloadend = () => {
    inputImg.value = reader.result;
  }
  reader.readAsDataURL(file);
}

function checkVideo(){
  const regex =
      /^(https?:\/\/)?(www\.)?(youtube\.com\/(channel\/|user\/|c\/)?[a-zA-Z0-9_-]{1,})|(youtu\.be\/[a-zA-Z0-9_-]{1,})/;
  return regex.test(inputContent.value);
}
// create the request body
function assembleBody(){
  let body = "";
  switch (inputType.value) {
    case 'MESSAGE_TEXT':
      body = inputContent.value;
      break;
    case 'IMAGE':
      body = inputImg.value;
      break;
    case 'VIDEO_URL':
      console.log(checkVideo());
      if (checkVideo())
        body = inputContent.value;
      else
        body = null;


  }
  console.log(body);
  return body;
}

// validation and fetch of the squeal
function postSqueal(){
  const uri =
      VueConfig.base_url_requests +
      "/squeal/from-smm/" +
      vipName;
  const squealBody = {}
  if(checkDest() === null)
    console.log(inputDest)
  assembleBody();
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
