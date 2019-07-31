import API_UTILS from '@/utils/API_UTILS';
import memberApi from "@/api/member";

export default {
    getEventByKey : (key:string):Promise<EventTypes> => new Promise<EventTypes>((resolve)=>{
        API_UTILS.database.ref(`events/${key}`)
            .on('value',(snapshot:any)=>{
                const event = snapshot.val();
                if(event){
                    event.key = snapshot.key;
                    event.contentKeys = Object.keys(event.contentKeys);
                    event.memberKeys = Object.keys(event.memberKeys);
                    event.placeKeys = Object.keys(event.placeKeys);
                    resolve(event);
                }
            })
    }),
    getEventsRange : (params:any):Promise<EventTypes[]> => new Promise<EventTypes[]>((resolve)=>{
        API_UTILS.database.ref('events')
            .orderByChild('date')
            .startAt(params.startAt)
            .endAt(params.endAt)
            .on('value',(snapshots:any)=>{
                const events:EventTypes[] = [];
                snapshots.forEach((snapshot:any)=>{
                    const child = snapshot.val();
                    child.key = snapshot.key;
                    events.push(child);
                })
                resolve(events);
            })
    }),
    updateEvent : async (payload:EventTypes) => {//key값을 넘기면 put, 안넘기면 post
        let {key, date, contentKeys, memberKeys, placeKeys, title} = payload;
        if(!key) key = API_UTILS.database.ref(`events`).push().key || '';
        
        const event = API_UTILS.database.ref(`events/${key}`)
        
        try {
            event.update({
                date,
                title,
                contentKeys : contentKeys && contentKeys.length ? API_UTILS.arrayConvertToObj(contentKeys) : {},
                memberKeys : memberKeys && memberKeys.length ? API_UTILS.arrayConvertToObj(memberKeys) : {},
                placeKeys : placeKeys && placeKeys.length ? API_UTILS.arrayConvertToObj(placeKeys) : {},
            })

            //멤버별 참여를 삭제후 다시 넣어줌
            await memberApi.deleteMembersParticipation(key);
            if(memberKeys) await memberApi.insertMembersParticipation(memberKeys, key, date);
        } catch(err){
            console.error(err);
        }

        return {...payload, key};
    },
    deleteEvent : (key:string):Promise<string> => new Promise<string>((res,rej)=>{
        try {
            const eventRef = API_UTILS.database.ref(`events/${key}`)
            eventRef.remove();
            memberApi.deleteMembersParticipation(key);
            res('success');
        } catch(err){
            console.error('del : ', err);
            rej('failed');
        }
    })
    
}
