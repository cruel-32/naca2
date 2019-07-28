import API_UTILS from './API_UTILS';

export default {
    getEventByUid : (uid:string):Promise<EventTypes> => new Promise<EventTypes>((resolve)=>{
        API_UTILS.database.ref('events')
            .orderByChild('uid')
            .equalTo(uid)
            .on('value',(snapshot:any)=>{
                const val = snapshot.val();
                resolve(val[Object.keys(val)[0]] || {});
            })
    }),
    getEvents : () => API_UTILS.database.ref('events').once('value').then((snapshot:any)=>snapshot.val()),
    getEventsRange : (params:any):Promise<EventTypes[]> => new Promise<EventTypes[]>((resolve)=>{
        API_UTILS.database.ref('events')
            .orderByChild('date')
            .startAt(params.startAt)
            .endAt(params.endAt)
            .on('value',(snapshot:any)=>{
                const val = snapshot.val();
                resolve(val ? Object.values(val) : []);
            })
    }),
    createEvent : (params:EventTypes) => API_UTILS.database.ref('events').once('value').then(snapshot=>{
        const num:number = snapshot.numChildren();
        let key:number = 1;
        snapshot.forEach(sn=>{
            sn.val().date === params.date && (key+=1)
        })
        let uid = `${params.date}-${key}`
        API_UTILS.database.ref(`events/${num}`).update({uid,...params})
        return uid;
    }),
    updateEvent : (uid:string, payload:EventTypes):Promise<string> => new Promise<string>((resolve)=>{
        API_UTILS.database.ref(`events`)
    })
    
    
}
