import Vue from 'vue'
import { Validator } from 'vee-validate';
import ApexCharts from 'apexcharts'

declare module 'vue/types/vue' {
  interface Vue {
    $moment: any,
    $validator: Validator,
    ApexCharts:ApexCharts,
  }
}
