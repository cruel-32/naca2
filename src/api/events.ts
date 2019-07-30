import API_UTILS from './API_UTILS';

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
            .on('value',(snapshot:any)=>{
                const events:EventTypes[] = [];
                snapshot.forEach((sn:any)=>{
                    const child = sn.val();
                    child.key = sn.key;
                    events.push(child);
                })
                resolve(events);
            })
    }),
    updateEvent : (payload:EventTypes) => {//key값을 넘기면 put, 안넘기면 post
        const {key, date, contentKeys, memberKeys, placeKeys, title} = payload;
        const newKey = key ? '' : API_UTILS.database.ref(`events`).push().key;
        const event = API_UTILS.database.ref(`events/${key || newKey}`)

        event.update({
            date,
            title,
            contentKeys : contentKeys.length ? API_UTILS.arrayConvertToObj(contentKeys) : {},
            memberKeys : memberKeys.length ? API_UTILS.arrayConvertToObj(memberKeys) : {},
            placeKeys : placeKeys.length ? API_UTILS.arrayConvertToObj(placeKeys) : {},
        })

        //멤버별 참여 이벤트도 업데이트 해줘야함. participation 

        return newKey ? {...payload, key:newKey} : payload;
    }
    
    
}
