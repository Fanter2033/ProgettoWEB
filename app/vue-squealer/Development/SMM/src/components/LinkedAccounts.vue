<template>
  <div class="container-fluid mx-0 px-0">
    <div class="row">
      <Nav/>
    </div>
    <div class="row d-flex">
      <div class="col-2">
        <SideBar/>
      </div>

      <div class="col-9">
        <div class="container-fluid d-flex flex-wrap justify-content-center">
          <div v-for="vip in myVipsData">
            <div class="row m-3">
              <div class="card d-flex align-items-center chill-font-small" style="width: 20rem; height: 25rem">
                <img
                    class="card-img-top m-2 border border-2 border-dark"
                    style="border-radius: 50%; height: 50%; width: 40%"
                    :src=" 'data:image/jpeg;base64,' + vip.pfp "
                    alt="profile picture"/>
                <div class="card-body">
                  <h3 class="card-title"> {{vip.username}} </h3>

                  <div class="card-text text-success">
                    <p class="text-success mb-0">popularity: {{vip.verbalized_popularity}}</p>
                    <p class="text-danger"> unpopularity: {{vip.verbalized_unpopularity}}</p>
                  </div>

                </div>
                <ul class="list-group list-group-flush reg-font-small" style="text-align: start;">
                  <li class="list-group-item">nome completo: <b>{{vip.first_name}} {{vip.last_name}}</b></li>
                  <li class="list-group-item">email: <b>{{vip.email}}</b></li>
                  <li class="list-group-item">attiv* dal: <b>{{fixDate(vip.registration_timestamp)}}</b></li>
                </ul>
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
import {onBeforeMount, ref} from "vue";
import {useStore} from "vuex";
import SideBar from "@/components/dashboard/SideBar.vue";
import Nav from "@/components/Nav.vue";

const myVipsData = ref([]);
const store = useStore();
//get all the vips
function getLinkedVips() {
  const myVips = store.getters.getVips;
  let uri = VueConfig.base_url_requests + '/user/';
  for (let i = 0; i < myVips.length; i++) {
    let v_uri = uri + myVips[i];
    console.log('fetch: ' + v_uri);
    fetch(v_uri, {
      method: 'GET',
      credentials: 'include',
      mode: 'cors'
    })
        .then((res) => {
          if (res.ok) {
            return res.json();
          } else {
            console.error("Error fetching vips", res)
          }
        })
        .then((data) => {
          myVipsData.value.push(data);
          console.log(data);
        })
        .catch((error) => {
          console.error("Network error", error);
        })
  }
}
function fixDate(timeStamp){
  const date = new Date(timeStamp * 1000);
  return date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
}

onBeforeMount(()=>{
  getLinkedVips();
})


</script>

<style>

</style>