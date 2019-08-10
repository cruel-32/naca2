import API_UTILS from '@/utils/API_UTILS';
import moment from 'moment';

export default {
    getMemberByKey : (key:string):Promise<IMemberTypes> => new Promise<IMemberTypes>((resolve,reject)=>{
        API_UTILS.database.ref(`members/${key}`)
            .once('value',(snapshot:any)=>{
                const member = snapshot.val();
                member.key = snapshot.key;

                if(member){
                    const VOarray = API_UTILS.objConvertToArray<number>(member.participation);
                    member.participation = VOarray;
                    member.participation.sort((next:IKeyAndValue<number>,prev:IKeyAndValue<number>):number => prev.value - next.value);
                    if(member.participation && member.participation.length > 0){
                        member.lastDate = member.participation[0]
                        member.firstDate = member.participation[member.participation.length-1]
                    } else {
                        member.lastDate = {Key:'', value:member.joinDate};
                        member.firstDate = {Key:'', value:member.joinDate};
                    }
                    resolve(member);
                }
            })
    }),

    getMembers : ():Promise<IMemberTypes[]> => API_UTILS.database.ref('members').once('value').then((snapshots:any)=>{
        const members:IMemberTypes[] = [];

        snapshots
            .forEach((snapshot:any)=>{
                const member = snapshot.val();
                member.key = snapshot.key;
                if(member.participation){
                    const VOarray = API_UTILS.objConvertToArray<number>(member.participation);
                    member.participation = VOarray;
                    member.participation.sort((next:IKeyAndValue<number>,prev:IKeyAndValue<number>):number => prev.value - next.value);

                    member.lastDate = member.participation[0]
                    member.firstDate = member.participation[member.participation.length-1]
                } else {
                    member.lastDate = {Key:'', value:member.joinDate};
                }
                members.push(member);
            })
        members.sort((memberA:IMemberTypes, memberB:IMemberTypes):number => memberA.name > memberB.name ? 1 : -1)
        return members
    }),

    getMembersInActive : ():Promise<IMemberTypes[]> => API_UTILS.database.ref('members').once('value').then((snapshots:any)=>{
        const members:IMemberTypes[] = [];

        snapshots
            .forEach((snapshot:any)=>{
                const member = snapshot.val();
                if(member.grade !== 6){
                    member.key = snapshot.key;
                    if(member.participation){
                        const VOarray = API_UTILS.objConvertToArray<number>(member.participation);
                        member.participation = VOarray;
                        member.participation.sort((next:IKeyAndValue<number>,prev:IKeyAndValue<number>):number => prev.value - next.value);
                        member.lastDate = member.participation.length > 0 ? member.participation[0] : {Key:'', value:member.joinDate};
                    } else {
                        member.lastDate = {Key:'', value:member.joinDate};
                    }
                    members.push(member);
                }
            })

        members.sort((memberA:IMemberTypes, memberB:IMemberTypes):number => memberA.name > memberB.name ? 1 : -1)
        return members
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
    }),
    insertMembersParticipation : (memberKeys:string[], key:string, date:number) =>{
        console.log('memberKeys : ', memberKeys);
        memberKeys.forEach((memberKey)=>{
            const memberRef = API_UTILS.database.ref(`members/${memberKey}`);
            memberRef.child('/participation').update({[key] : date});
            memberRef.once('value',(snapshot)=>{
                const member = snapshot.val();
                if(member.grade === 4 && (snapshot.child('participation').numChildren() > 0) ){
                    //자동등업 준회원 >>> 신입
                    memberRef.child('/grade').set(3);
                } else if(member.grade === 3 && (snapshot.child('participation').numChildren() > 3) ){
                    memberRef.child('/grade').set(2);
                    //자동등업 신입 >>> 일반
                }
            })
        })
        // Promise.all(
        //     memberKeys.map(memberKey => API_UTILS.database.ref(`members/${memberKey}/participation`).update({[key] : date}))
        // ).then(results=>{
        //     console.log('insertMembersParticipation results : ', results);
        //     return results
        // }),
    },
    //key값을 넘기면 put, 안넘기면 post
    updateMember : async (payload:IMemberTypes):Promise<IMemberTypes> => {
        let {key, address, birth, gender, grade, joinDate, mail, phone, name, job} = payload;
        let params:any = {
            address, birth, gender, grade, joinDate, mail, phone, name, job
        }

        if(!key){
            key = API_UTILS.database.ref(`members`).push().key || '';
            params['participation'] = {};
        }

        return API_UTILS.database.ref(`members/${key}`).update(params)
    },

    deleteMember : (key:string):Promise<string> => {
        return API_UTILS.database.ref(`members/${key}`).update({
            outDay : parseInt(moment(new Date()).format('YYYYMMDD')),
            grade : 6,
        })
    },

    
}