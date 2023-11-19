<template>
  <button type="button"
          class="btn"
          @click="openModal">
    <i class="bi p-1 bi-send-plus"></i>
    <span class="d-none d-sm-inline">Quick Squeal</span>
  </button>

  <div class="modal fade" id="quickSqueal" tabindex="-1"  aria-hidden="true">
    <div class="modal-dialog" >
      <div class="modal-content">

        <div class="modal-header">
          <h3 class="modal-title"><b>Quick Squeal</b></h3>
          <h6>Write a squeal from __NAME__</h6>
        </div>
        <div class="modal-body">
          <form>
            <div class="form-group">
              <label for="recipient-name" class="col-form-label">Destinatari:</label>
              <input type="text" class="form-control" id="dest">
            </div>
            <div class="form-group">
              <label for="message-text" class="col-form-label">Squeal</label>
              <textarea class="form-control" id="message"></textarea>
            </div>
          </form>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeModal">Close</button>
            <button type="button" class="btn btn-primary">Post for __Name__</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import {reactive, onMounted} from "vue";

  const state = reactive({
    modal_demo: null,
  })

  onMounted(() => {
    state.modal_demo = new bootstrap.Modal(document.getElementById('quickSqueal'), {})
  })

  function openModal()
  {
    state.modal_demo.show()
  }

  function closeModal()
  {
    state.modal_demo.hide()
  }

</script>

<style>
  .modal-title{
    color: yellow;
  }
  .btn{
    background-color: green;
  }
  .modal-content{
    background-color: midnightblue;
  }

</style>