import defaults from './defaults';

export default {
    getContents : () => defaults.database.ref('contents').once('value').then((snapshot:any)=>snapshot.val()),

}