import API_UTILS from './API_UTILS';

export default {
    getMembers : () => API_UTILS.database.ref('members').once('value').then((snapshots:any)=>{
        const members:MemberTypes[] = [];
        snapshots.forEach((snapshot:any)=>{
            const child = snapshot.val();
            child.key = snapshot.key;
            child.participation = child.participation ? Object.keys(child.participation) : [];
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
    insertMembersParticipation : (memberKeys:string[], key:string)=> {
        let result = 'success';
        try {
            memberKeys.forEach(memberKey=>{
                API_UTILS.database.ref(`members/${memberKey}/participation`)
                    .update({
                        [key] : API_UTILS.firebase.database.ServerValue.TIMESTAMP
                    })
            });
        } catch(error){
            result = 'error'
        }
        return result;
    }
}