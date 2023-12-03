<template>
  <Doughnut :data="chartData" :options="chartOptions" />
</template>

<script>
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import {Doughnut} from "vue-chartjs";
ChartJS.register(ArcElement, Tooltip, Legend);

export default {
  name: 'DoughnutChart',
  components: {
    Doughnut
  },
  data(){
    return{
      chartData: {
        labels: ['like a lot', 'like', 'do not like', 'disgusted'],
        datasets: [{
            backgroundColor: ['#41B883', '#E46651', '#00D8FF', '#DD1B16'],
            data: [40, 20, 80, 10],
          }]

      },
      chartOptions: {
        responsive: true,
      }
    }
  }
}

</script>

<style>

</style>
