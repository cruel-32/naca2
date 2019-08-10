import API_UTILS from '@/utils/API_UTILS';

export default {
    getContents : ():Promise<IContentTypes[]> => API_UTILS.database.ref('contents').once('value').then((snapshots:any)=>{
        const contents:IContentTypes[] = [];
        snapshots.forEach((snapshot:any)=>{
            const child = snapshot.val();
            child.key = snapshot.key;
            contents.push(child);
        })
        return contents.sort((prev:IContentTypes, next:IContentTypes):number=> prev.name < next.name ? -1 : 1)

    }),

}