import API_UTILS from './API_UTILS';

export default {
    getMembers : () => API_UTILS.database.ref('members').once('value').then((snapshot:any)=>{
        const members:MemberTypes[] = [];
        snapshot.forEach((sn:any)=>{
            const child = sn.val();
            child.key = sn.key;
            child.participation = child.participation ? Object.keys(child.participation) : [];
            members.push(child);
        })
        return members
    }),
}