<template>
  <v-list two-line>
    <v-subheader class="headline" style="color:rgba(0,0,0,.87);">
      <v-icon color="green">insert_chart</v-icon>
      <span class="pl-1">통계목록</span>
    </v-subheader>

    <template v-for="(item, index) in dashboardMenu">
      <v-divider
        v-if="item.divider"
        :key="index"
      ></v-divider>

      <v-list-tile
        v-if="item.title"
        :key="item.title"
        @click="$router.push(item.link);"
      >
        <v-list-tile-content>
          <v-list-tile-title v-html="item.title"></v-list-tile-title>
          <v-list-tile-sub-title v-html="item.subtitle"></v-list-tile-sub-title>
        </v-list-tile-content>
      </v-list-tile>
    </template>
  </v-list>
</template>


<script lang="ts">
import { Component, Prop, Vue, Watch, Emit } from 'vue-property-decorator';
import { accountStore } from "@/stores/modules/account"
import { eventStore } from "@/stores/modules/event";
import { dialogStore } from "@/stores/modules/dialog"
import { menuStore } from "@/stores/modules/menu"

@Component
export default class Events extends Vue {
  //stores
  get currentUser(){ return accountStore.currentUser }
  get events(){ return eventStore.events }
  get snackBar(){ return dialogStore.snackBar }
  get dashboardMenu(){ return menuStore.dashboardMenu }

  created(){
    console.log('dashboard home');
  }

}
</script>

<style lang="scss">
</style>