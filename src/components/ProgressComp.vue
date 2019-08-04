<template>
  <div class="bg" v-if="progress">
    <v-progress-circular
      :size="70"
      :width="7"
      color="amber"
      indeterminate
      fixed
    ></v-progress-circular>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { menuStore } from "@/stores/modules/menu"

@Component
export default class ProgressComp extends Vue {
  get progress(){
    return menuStore.progress
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.bg {
  position: fixed;
  z-index: 20;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.8);
  .v-progress-circular {
    position:absolute;
    top:50%;
    left:50%;
    transform:translate(-50%,-50%);
  }
}
</style>