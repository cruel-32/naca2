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
    getEvents : () => API_UTILS.database.ref('events').once('value').then((snapshot:any)=>{
        console.log('snapshot : ', snapshot);

        return snapshot.val()
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
    createEvent : (params:EventTypes) => API_UTILS.database.ref('events').once('value').then(snapshot=>{

        return '';
    }),
    updateEvent : (key:string, payload:EventTypes):Promise<string> => new Promise<string>((resolve)=>{
        API_UTILS.database.ref(`events`)
    })
    
    
}
