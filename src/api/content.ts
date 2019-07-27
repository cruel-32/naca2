import API_UTILS from './API_UTILS';

export default {
    getContents : () => API_UTILS.database.ref('contents').once('value').then((snapshot:any)=>snapshot.val()),

}