import API_UTILS from '@/utils/API_UTILS';

export default {
    getContents : () => API_UTILS.database.ref('contents').once('value').then((snapshots:any)=>{
        const contents:ContentTypes[] = [];
        snapshots.forEach((snapshot:any)=>{
            const child = snapshot.val();
            child.key = snapshot.key;
            contents.push(child);
        })
        return contents
    }),

}