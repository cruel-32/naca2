import API_UTILS from './API_UTILS';
import memberApi from "@/api/member";

export default {
    getEventByKey : (key:string):Promise<EventTypes> => new Promise<EventTypes>((resolve)=>{
        API_UTILS.database.ref(`events/${key}`)
            .on('value',(snapshot:any)=>{
                if(snapshot.key){
                    const event = snapshot.val();
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
        const {date, contentKeys, memberKeys, placeKeys, title} = payload;
        let {key} = payload;
        if(!key){
            key = API_UTILS.database.ref(`events`).push().key || '';
        }
        const event = API_UTILS.database.ref(`events/${key}`)
        
        try {
            event.update({
                date,
                title,
                contentKeys : contentKeys.length ? API_UTILS.arrayConvertToObj(contentKeys) : {},
                memberKeys : memberKeys.length ? API_UTILS.arrayConvertToObj(memberKeys) : {},
                placeKeys : placeKeys.length ? API_UTILS.arrayConvertToObj(placeKeys) : {},
            })

            //멤버별 참여를 삭제후 다시 넣어줌
            await memberApi.deleteMembersParticipation(key);
            await memberApi.insertMembersParticipation(memberKeys, key);
        } catch(err){
            console.error(err);
        }

        return {...payload, key};
    },
    deleteEvent : (key:string):Promise<string> => new Promise<string>((res,rej)=>{
        try {
            const eventRef = API_UTILS.database.ref(`events/${key}`)

            //멤버별 참여 이벤트도 업데이트 해줘야함. participation 
            eventRef.remove();
            memberApi.deleteMembersParticipation(key);
            res('success');
        } catch(err){
            console.error('del : ', err);
            rej('failed');
        }
    })
    
}
