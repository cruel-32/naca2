import API_UTILS from './API_UTILS';

export default {
    getContents : () => API_UTILS.database.ref('contents').once('value').then((snapshot:any)=>{
        const contents:ContentTypes[] = [];
        snapshot.forEach((sn:any)=>{
            const child = sn.val();
            child.key = sn.key;
            contents.push(child);
        })
        return contents
    }),

}