import defaults from './defaults';

export default {
    getPlaces : () => defaults.database.ref('places').once('value').then((snapshot:any)=>snapshot.val()),

}