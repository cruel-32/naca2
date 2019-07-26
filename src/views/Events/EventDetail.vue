<template>
  <v-container fluid>
    <v-slide-y-transition mode="out-in">
      <v-layout column align-center>
        <form id="create-meeting-dialog" class="ui form" @submit.prevent="postEvent">
          <v-card>
            <v-card-title class="pb-0">
              <span class="headline">
                {{isNew ? "모임 생성" : "모임 수정"}}
              </span>
            </v-card-title>
          </v-card>
          <v-card-text class="pa-0">
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12 sm6 md4>
                  <v-text-field
                    v-model="eventDate"
                    label="모임 날짜"
                    required
                    readonly
                    disabled
                  ></v-text-field>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>
        </form>
      </v-layout>
    </v-slide-y-transition>
  </v-container>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch, Emit } from 'vue-property-decorator';
import { eventStore } from "@/stores/modules/event";

@Component
export default class EventDetail extends Vue {
  isNew:boolean = false;
  eventDate:string = '2019-01-01';
  get computedDateFormatted () {
    return '2019-07-01';
    // return this.$moment(this.params.key.toString()).format('YYYY-MM-DD');
  }

  created(){
    const uid = this.$route.params;
    console.log('this.$route uid : ', uid)
  }

  postEvent(e:any){
    console.log('e : ', e);
  }
}
</script>

<style scoped lang="scss">
.v-card {
  box-shadow:none;
}
</style>