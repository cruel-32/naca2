import API_UTILS from './API_UTILS';

export default {
    getMembers : () => API_UTILS.database.ref('members').once('value').then((snapshot:any)=>snapshot.val()),
}