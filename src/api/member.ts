import API_UTILS from '@/utils/API_UTILS';

export default {
    getMembers : ():Promise<MemberTypes[]> => API_UTILS.database.ref('members').once('value').then((snapshots:any)=>{
        const members:MemberTypes[] = [];

        snapshots.forEach((snapshot:any)=>{
            const member = snapshot.val();
            member.key = snapshot.key;
            if(member.participation){
                const {keys, values} = API_UTILS.objConvertToKeysAndValues<number>(member.participation);
                member.eventKeys = keys;
                member.participation = values;
                member.lastDate = Math.max(...values);
            }
            members.push(member);
        })
        return members
    }),

    getMemberByKey : (key:string):Promise<MemberTypes> => new Promise<MemberTypes>((resolve,reject)=>{
        API_UTILS.database.ref(`members/${key}`)
            .on('value',(snapshot:any)=>{
                const member = snapshot.val();
                member.key = snapshot.key;

                if(member){
                    const {keys, values} = API_UTILS.objConvertToKeysAndValues<number>(member.participation);
                    member.eventKeys = keys;
                    member.participation = values;
                    member.lastDate = Math.max(...values);
                    resolve(member);
                }
            })
    }),

    deleteMembersParticipation : (key:string):Promise<string> => new Promise<string>((resolve)=>{
        API_UTILS.database.ref(`members`)
            .orderByChild(`participation/${key}`)
            .startAt(1)
            .once('value', (snapshots)=>{
                snapshots.forEach((snapshot)=>{
                    snapshot.ref.child(`participation/${key}`).remove();
                });
                resolve('success');
            })
    })
    ,
    insertMembersParticipation : (memberKeys:string[], key:string, date:number):Promise<string[]> =>
        Promise.all([
            ...memberKeys.map(memberKey=> API_UTILS.database.ref(`members/${memberKey}/participation`).update({[key] : date}))
        ]).then(results=>{
            console.log('insertMembersParticipation results : ', results);
            return results
        })
}