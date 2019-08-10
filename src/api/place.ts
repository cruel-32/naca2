import API_UTILS from '@/utils/API_UTILS';

export default {
    getPlaces : () => API_UTILS.database.ref('places').once('value').then((snapshots:any)=>{
        const places:IPlaceTypes[] = [];
        snapshots.forEach((snapshot:any)=>{
            const child = snapshot.val();
            child.key = snapshot.key;
            places.push(child);
        })
        return places.sort((prev:IPlaceTypes, next:IPlaceTypes):number=> prev.name < next.name ? -1 : 1)
    }),

}