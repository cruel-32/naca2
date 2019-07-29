import API_UTILS from './API_UTILS';

export default {
    getPlaces : () => API_UTILS.database.ref('places').once('value').then((snapshot:any)=>{
        const places:PlaceTypes[] = [];
        snapshot.forEach((sn:any)=>{
            const child = sn.val();
            child.key = sn.key;
            places.push(child);
        })
        return places
    }),

}