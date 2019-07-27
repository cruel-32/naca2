import Vue from 'vue'
import { Validator } from 'vee-validate';
declare module 'vue/types/vue' {
  interface Vue {
    $moment: any,
    $validator: Validator,
  }
}
