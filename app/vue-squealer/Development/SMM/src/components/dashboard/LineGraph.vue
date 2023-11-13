<template>

  <Line
    id="Pop-squeal"
    :options="chartOptions"
    :data="chartData"
    />

</template>

<script>

import Nav from "@/components/Nav.vue";
import SideBar from "@/components/dashboard/SideBar.vue";

import { Bar, Line } from 'vue-chartjs'
import {
  Chart as ChartJS, Title,
  Tooltip, Legend, BarElement,
  CategoryScale, LinearScale
} from 'chart.js';

ChartJS.register(
    Title, Tooltip, Legend,
    BarElement, CategoryScale, LinearScale
)


export default {
  name: 'LineGraphs',
  components: { Line },
  data(){
    return{
      chartData: {
        label: 'Popolarità squeal',
        labels: ['Gen', 'Feb ', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'], // queste possono essere filtrate per settimana-mese e anno
        data: [40,50,20,10,60,70,5,40,40,90,53,0], //dati presi dal database, calcolo viene fatto front
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
