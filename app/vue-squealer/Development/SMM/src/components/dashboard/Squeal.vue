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
              <input type="text" class="form-control" id="dest" />
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
                />
              </div>

              <div v-else-if="inputType === 'VIDEO_URL'" class="p-2">
                <label for="message-video" class="col-form-label"
                  >Share a YouTube video</label
                >
                <br />
                <input type="url" id="message-video" name="message-video" />
              </div>

              <div v-else-if="inputType === 'POSITION'">
                <h3>
                  WORK IN PROGRESS...
                  <img
                    src="../../../public/media/k.gif"
                    alt="work in progress"
                    style="width: 50px"
                  />
                </h3>
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
            <button type="button" class="btn btn-primary">
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
import { reactive, onMounted } from "vue";
import { ref } from "vue";

const props = defineProps({
  vip: String,
});
const vipName = ref("");
const viewTips = ref("");
const state = reactive({
  modal_demo: null,
});
const inputType = ref("MESSAGE_TEXT");
const inputDest = ref([]);
const inputOneField = ref("");


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

/*queries*/
function assembleBody(){
  switch (inputType) {
    case 'MESSAGE_TEXT':

  }
}

function postSqueal(squeal){
  const uri =
      VueConfig.base_url_requests +
      "/squeal/from-smm/" +
      vipName;
  const squealBody = {}
  //TODO: validazione dati inseriti
  fetch(uri, {
    method:'POST',
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    mode: "cors",
  })



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
