<template>
  <v-container fluid>
    <v-slide-y-transition mode="out-in">
      <v-layout column align-center>
        <form id="create-event-dialog" class="ui form" @submit.prevent="postEvent">
          <v-card>
            <v-card-title class="pb-0">
              <span class="headline">
                {{isNew ? "이벤트 생성" : "이벤트 수정"}}
              </span>
            </v-card-title>
          </v-card>
          <v-card-text class="pa-0">
            <v-container grid-list-md>
              <v-layout wrap>

                <v-flex xs12 sm6 md4>
                  <v-text-field
                    v-model="eventDate"
                    label="이벤트 날짜"
                    required
                    readonly
                    disabled
                  ></v-text-field>
                </v-flex>
                
                <v-flex xs12 sm6 md4>
                  <v-text-field
                    v-validate="'required|min:1|max:20'"
                    v-model="event.title"
                    :counter="20"
                    label="타이틀"
                    data-vv-name="title"
                    :error-messages="errors.collect('title')"
                    clearable
                  ></v-text-field>
                </v-flex>

                <!-- <v-flex xs12>
                  <v-select
                    v-validate="'required'"
                    v-model="event.place"
                    :items="places"
                    item-value="key"
                    item-text="name"
                    :error-messages="errors.collect('place')"
                    label="장소"
                    data-vv-name="place"
                  ></v-select>
                </v-flex> -->
                
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
import { accountStore } from "@/stores/modules/account"
import { eventStore } from "@/stores/modules/event";
import { contentStore } from "@/stores/modules/content";
import { placeStore } from "@/stores/modules/place";
import { gradeStore } from "@/stores/modules/grade";

@Component
export default class EventDetail extends Vue {
  get contents(){
    return contentStore.contents
  }

  get grades(){
    return gradeStore.grades
  }

  get places(){
    return placeStore.places
  }
  
  get event(){
    return eventStore.event
  }

  get currentUser(){
    return accountStore.currentUser
  }

  get isNew(){
    return this.$route.name === 'eventCreate'
  }

  get eventDate(){
    return this.event.date ? 
      this.$moment(this.event.date.toString()).format('YYYY-MM-DD')
      : ''
  }

  get computedDateFormatted () {
    return '2019-07-01';
    // return this.$moment(this.params.key.toString()).format('YYYY-MM-DD');
  }
  

  created(){
    const {uid} = this.$route.params;
    eventStore.getEventByUid(uid);
    contentStore.getContents();
    placeStore.getPlaces();
    gradeStore.getGrades();

    console.log('this.event : ', this.event);
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