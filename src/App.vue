<template>
  <v-app
    app
  >
    <Home></Home>
    <router-view />
  </v-app>
</template>

<script>
import { Component, Vue } from 'vue-property-decorator'
import Home from './views/Home';
import { accountStore } from '@/stores/modules/account'

@Component({
  name: 'App',
  components: {
    Home
  }
})
export default class extends Vue {
  created(){
    console.log('accountStore : ', accountStore);
  }
}
</script>
