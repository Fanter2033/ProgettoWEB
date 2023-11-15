<template>

  <Line
    id="Pop-squeal"
    :options="chartOptions"
    :data="chartData"
    />

</template>

<script>
import { Line } from 'vue-chartjs';
import 'chart.js/auto'

export default {
  name: 'LineChart',
  components: { Line },
  data(){
    return{
      chartData: {
        labels: ['Gen', 'Feb ', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'], // queste possono essere filtrate per settimana-mese e anno
        datasets: [{
          label:'popularity',
          data: [40,50,20,10,60,70,5,40,40,90,53,0], //dati presi dal database, calcolo viene fatto front
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
