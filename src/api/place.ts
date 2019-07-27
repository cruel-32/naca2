import API_UTILS from './API_UTILS';

export default {
    getPlaces : () => API_UTILS.database.ref('places').once('value').then((snapshot:any)=>snapshot.val()),

}