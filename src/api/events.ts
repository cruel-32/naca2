import API_UTILS from '@/utils/API_UTILS';
import memberApi from "@/api/member";

export default {
    getEventByKey : (key:string):Promise<IEventTypes> => new Promise<IEventTypes>((resolve)=>{
        API_UTILS.database.ref(`events/${key}`)
            .once('value',(snapshot:any)=>{
                const event = snapshot.val();
                console.log('api getEventByKey event : ', event);
                if(event){
                    event.key = snapshot.key;
                    event.contentKeys = event.contentKeys ? Object.keys(event.contentKeys) : [];
                    event.memberKeys = event.memberKeys ? Object.keys(event.memberKeys) : [];
                    event.placeKeys = event.placeKeys ? Object.keys(event.placeKeys) : [];
                    resolve(event);
                }
            })
    }),
    getEventsRange : (params:IDateRange):Promise<IEventTypes[]> => new Promise<IEventTypes[]>((resolve)=>{
        API_UTILS.database.ref('events')
            .orderByChild('date')
            .startAt(params.startAt)
            .endAt(params.endAt)
            .once('value',(snapshots:any)=>{
                const events:IEventTypes[] = [];
                snapshots.forEach((snapshot:any)=>{
                    const event = snapshot.val();
                    event.key = snapshot.key;
                    event.contentKeys = event.contentKeys ? Object.keys(event.contentKeys) : [];
                    event.memberKeys = event.memberKeys ? Object.keys(event.memberKeys) : [];
                    event.placeKeys = event.placeKeys ? Object.keys(event.placeKeys) : [];
                    events.push(event);
                })
                resolve(events);
            })
    }),
    updateEvent : async (payload:IEventTypes):Promise<IEventTypes> => {//key값을 넘기면 put, 안넘기면 post
        let {key, date, contentKeys, memberKeys, placeKeys, title} = payload;
        if(!key) key = API_UTILS.database.ref(`events`).push().key || '';
        
        const event = API_UTILS.database.ref(`events/${key}`)
        
        event.update({
            date,
            title,
            contentKeys : contentKeys && contentKeys.length ? API_UTILS.arrayConvertToObj(contentKeys) : {},
            memberKeys : memberKeys && memberKeys.length ? API_UTILS.arrayConvertToObj(memberKeys) : {},
            placeKeys : placeKeys && placeKeys.length ? API_UTILS.arrayConvertToObj(placeKeys) : {},
        })

        //멤버별 참여를 삭제후 다시 넣어줌
        const msg = await memberApi.deleteMembersParticipation(key);
        console.log('msg : ', msg);
        const results = await memberApi.insertMembersParticipation(memberKeys, key, date);
        console.log('results : ', results);
        return {...payload, key};
    },
    deleteEvent : (key:string):Promise<string> => new Promise<string>((res,rej)=>{
        try {
            const eventRef = API_UTILS.database.ref(`events/${key}`)
            eventRef.remove();
            memberApi.deleteMembersParticipation(key);
            res('success');
        } catch(err){
            rej('error');
        }
    })
    
}
