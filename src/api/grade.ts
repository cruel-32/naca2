import API_UTILS from './API_UTILS';

export default {
    getGrades : () => API_UTILS.database.ref('grades').once('value').then((snapshot:any)=>snapshot.val()),

}