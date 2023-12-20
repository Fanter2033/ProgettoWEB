<template>
  <div class="container-fluid">
    <Line
        v-if="loaded"
        id="Pop-squeal"
        :data="chartData"
        :options="chartOptions"
    />
  </div>
</template>

<script>
import {Line} from 'vue-chartjs';
import 'chart.js/auto';
import {store} from "@/store";

export default {
  name: 'LineChart',
  components: {Line},
  data() {
    return {
      loaded: false,
      chartData: null
    };
  },
  methods: {
    populateLabels: function () {
      const x_labels = [];
      const y_labels_pos = [];
      const y_labels_neg = [];
      const squeals = store.getters.getLineChartData || [];

      for (let i = 0; i < squeals.length; i++) {
        const obj = squeals[i];
        const date = new Date(obj.timestamp * 1000);
        x_labels.push(date.getDate().toString() + '/' + (date.getMonth() + 1).toString() + '/' + date.getFullYear().toString());
        y_labels_pos.push(obj.positive_value);
        y_labels_neg.push(obj.negative_value);
      }

      return {
        labels: x_labels,
        datasets: [
          {
            label: 'Positive popularity',
            data: y_labels_pos,
            borderColor: '#498bff',
            backgroundColor: 'rgba(73, 139, 255,0.5)'
          },
          {
            label: 'Negative popularity',
            data: y_labels_neg,
            borderColor: '#de2525',
            backgroundColor: 'rgba(222, 37, 37,0.5)'
          }
        ],
      };
    },
    updateChartData: function () {
      try {
        this.chartData = this.populateLabels();
        this.loaded = true;
      } catch (e) {
        console.error(e);
      }
    },
  },
  watch: {
    '$store.state.LineChartData': {
      handler: 'updateChartData',
      deep: true,
    },
  },
  mounted() {
    this.updateChartData();
  },
  computed: {
    chartOptions() {
      return {
        responsive: true,
      };
    },
  },

};
</script>

<style>
</style>
