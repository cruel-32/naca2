<template>
  <div>
    MembersAge
  </div>
</template>


<script lang="ts">
import { Component, Prop, Vue, Emit } from 'vue-property-decorator';

@Component
export default class MembersAge extends Vue {
  @Prop() currentUser: any;
  @Prop() query: any;
  @Prop() params: any;
  @Emit('showSnackbar') showSnackbar(color:string,text:string){}

  created(){
    // console.log('currentUser : ', this.currentUser);
    // console.log('query : ', this.query);
    // console.log('params : ', this.params);
  }
}
</script>

<style lang="scss">
</style>