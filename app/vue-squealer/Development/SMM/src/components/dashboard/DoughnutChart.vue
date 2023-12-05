<template>
  <div class="d-flex justify-content-around">
    <button class="btn" @click="prevSqueal">
      {{ "<" }}
    </button>
    <div class="card " style="width: 18rem;">
      <div class="card-header"><h5>Squeal del {{actualSqueal.date}}</h5></div>
      <div class="card-body">
        <p class="card-text border rounded p-1"> {{actualSqueal.content}} </p>
      </div>
      <div class="card-footer text-muted">
        costo: {{actualSqueal.cost}}
      </div>
    </div>
    <div class="card" style="width: 18rem;">
      <div class="card-body">
        <Doughnut :data="chartData" :options="chartOptions"/>
      </div>
    </div>

    <button class="btn" @click="nextSqueal">
      {{ ">" }}
    </button>

  </div>
</template>

<script setup>
import {onMounted, ref} from "vue";
import {Chart as ChartJS, ArcElement, Tooltip, Legend} from 'chart.js'
import {Doughnut} from "vue-chartjs";
import {useStore} from "vuex";
const store = useStore();

ChartJS.register(ArcElement, Tooltip, Legend);

const actualSqueal = ref({});
const index = ref(0);
function assebleSqueal(){
  const squealDate = new Date(store.getters.getDoughnutChart[index.value].date * 1000);
      actualSqueal.value = {
        date: squealDate.getDate() + '/' + squealDate.getMonth() + '/' + squealDate.getFullYear(),
        content: store.getters.getDoughnutChart[index.value].content,
        cost: store.getters.getDoughnutChart[index.value].quote_cost
      }
}

function nextSqueal(){
  if(index.value < store.getters.getDoughnutChart.length - 1){
    index.value = index.value + 1;
    console.log(index.value)
    assebleSqueal();
  }
}
function prevSqueal(){
  if(index.value > 0){
    index.value = index.value - 1;
    console.log(index.value)
    assebleSqueal();
  }
}

//e quiiii aspettiamo le funzioni di Denis
const chartData = ref( {
        labels: ['like a lot', 'like','not like', 'disgusted'],
        datasets: [{
          backgroundColor: ['#498bff',"#1ad921","#d5e118",'#de2525'],
          data: [1, 1,2,4],
        }]
      });
const chartOptions = ref ({
        responsive: true,
        maintainAspectRatio: false
})

onMounted(() => {
  index.value = 0;
  console.log('i ' + index.value)
  assebleSqueal()
})
</script>

<style>

</style>
