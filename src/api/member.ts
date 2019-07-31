import API_UTILS from '@/utils/API_UTILS';

export default {
    getMembers : () => API_UTILS.database.ref('members').once('value').then((snapshots:any)=>{
        const members:MemberTypes[] = [];

        snapshots.forEach((snapshot:any)=>{
            const child = snapshot.val();
            child.key = snapshot.key;
            if(child.participation){
                const keys = [];
                const dateList:number[] = [];
                for (let [key, value] of Object.entries(child.participation)) {
                    keys.push(key);
                    dateList.push(<number>value);
                }
                child.participation = keys;
                child.lastDate = Math.max(...dateList);
            }
            members.push(child);
        })
        return members
    }),
    deleteMembersParticipation : (key:string) => 
        API_UTILS.database.ref(`members`)
            .orderByChild(`participation/${key}`)
            .startAt(1)
            .once('value', (snapshots)=>{
                snapshots.forEach((snapshot)=>{
                    snapshot.ref.child(`participation/${key}`).remove();
                });
            })
    ,
    insertMembersParticipation : (memberKeys:string[], key:string, date:number)=> {
        let result = 'success';
        try {
            memberKeys.forEach(memberKey=>{
                API_UTILS.database.ref(`members/${memberKey}/participation`)
                    .update({
                        [key] : date
                    })
            });
        } catch(error){
            result = 'error'
        }
        return result;
    }
}