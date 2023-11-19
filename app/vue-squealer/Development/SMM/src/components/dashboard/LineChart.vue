<template>

  <Line
      v-if="loaded"
    id="Pop-squeal"
    :options="chartOptions"
    :data="chartData"
    />

</template>

<script>
import { Line } from 'vue-chartjs';
import 'chart.js/auto'
import {store} from "@/store";

export default {
  name: 'LineChart',
  components: {Line},
  methods: {
    populateLabels: function () {
      let x_labels = [];
      let y_labels_pos = [];
      let y_labels_neg = [];
      let obj;
      let squeals = JSON.parse(JSON.stringify(store.getters.getLineChartData));
      for (let i = 0; i < squeals.length; i++) {
        obj = squeals[i];
        let date = new Date(obj.timestamp * 1000);
        console.log(date);
        x_labels.push(date.getDate());
        let value = obj.positive_value;
        y_labels_pos.push(value);
        value = obj.negative_value;
        y_labels_neg.push(value);
      }
      return{
        labels: x_labels,
        datasets: [{
          label: 'popularity',
          data: y_labels_pos,
        }]
      };
    }
  },
  data: () => ({
    loaded:false,
    chartData: null,
  }),
  async mounted() {
    this.loaded = false;
    try {
      this.chartData = this.populateLabels();
      this.loaded = true;
    } catch (e) {
      console.error(e);
    }
  },
  computed: {
    chartOptions() {
      return{
        responsive: true,
      }
    },
    LineChartData(){
      return this.$store.state.LineChartData;
    }
  }
}

</script>

<style>

</style>
