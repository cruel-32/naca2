<template>
  <v-app>
    <v-toolbar app>
      <v-toolbar-title class="headline text-uppercase">
        <span>Vuetify</span>
        <span class="font-weight-light">MATERIAL DESIGN</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn
        flat
        href="https://github.com/vuetifyjs/vuetify/releases/latest"
        target="_blank"
      >
        <span class="mr-2">Latest Release</span>
      </v-btn>
    </v-toolbar>

    <v-content>
      <HelloWorld/>
    </v-content>
  </v-app>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import HelloWorld from './components/HelloWorld'

export default {
  name: 'App',
  components: {
    HelloWorld
  },
  created(){
    this.addMember();
    this.testMember();
    this.addEvent();
    this.testEvent();
    console.log('this.eventStore : ', this.eventStore);
    console.log('this.memberStore : ', this.memberStore);
  },
  computed: mapState({
    eventStore: state => state.eventStore,
    memberStore: state => state.memberStore,
  }),
  methods : {
    ...mapMutations('memberStore', [
      'addMember',
    ]),
    ...mapMutations('eventStore', [
      'addEvent',
    ]),
    ...mapActions('memberStore', [
      'testMember'
    ]),
    ...mapActions('eventStore', [
      'testEvent'
    ])
  },
  data () {
    return {
    }
  }
}
</script>
