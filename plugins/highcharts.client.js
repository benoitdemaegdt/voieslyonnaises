import Highcharts from 'highcharts';
import Gantt from 'highcharts/modules/gantt';
import HighchartsVue from 'highcharts-vue';

Gantt(Highcharts);

export default defineNuxtPlugin(nuxtApp => {
  nuxtApp.vueApp.use(HighchartsVue);
});
