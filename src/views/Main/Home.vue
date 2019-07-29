<template>
  <v-container fluid>
    <v-slide-y-transition mode="out-in">
      <v-layout column align-left>

        <v-list-tile three-line
          class="custom_tile"
          v-for="item in sideMenuItems"
          :key="item.title"
          avatar
          @click="goPage(item.link)"
        >
          <v-list-tile-avatar>
            <v-icon :color="item.color" :class="[item.iconClass]" >{{ item.icon }}</v-icon>
          </v-list-tile-avatar>
          <v-list-tile-content>
            <v-list-tile-title>{{ item.title }}</v-list-tile-title>
            <v-list-tile-sub-title>{{ item.subtitle }}</v-list-tile-sub-title>
          </v-list-tile-content>
        </v-list-tile>

      </v-layout>
    </v-slide-y-transition>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { menuStore } from "@/stores/modules/menu"

@Component({
  computed : {
    sideMenuItems(){//store는 이걸로 가즈아
      return menuStore.sideMenuItems 
    }
  }
})
export default class Home extends Vue {
  // get sideMenuItems(){
  //   return menuStore.sideMenuItems
  // }
  goPage(name:string){
    this.$router.push({
      name,
    });
  }
}
</script>

<style scoped lang="scss">
.custom_tile {
  margin: 30px 0 15px 5%;
  .v-icon {
    font-size:40px;
  }
  .v-list__tile__title {
    font-size:24px;
  }
  .v-list__tile__sub-title {
    font-size:18px;
  }

}
</style>