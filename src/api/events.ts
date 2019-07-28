import API_UTILS from './API_UTILS';

export default {
    getEventByUid : (uid:string):Promise<EventTypes> => new Promise<EventTypes>((resolve)=>{
        API_UTILS.database.ref('events')
            .orderByChild('uid')
            .equalTo(uid)
            .on('value',(snapshot:any)=>{
                const val = snapshot.val();
                resolve(val[Object.keys(val)[0]] || {
                    date:0
                });
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
}
