import defaults from './defaults';

export default {
    getGrades : () => defaults.database.ref('grades').once('value').then((snapshot:any)=>snapshot.val()),

}