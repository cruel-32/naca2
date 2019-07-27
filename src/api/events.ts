import defaults from './defaults';

export default {
    getEventByUid : (uid:string):Promise<EventTypes> => new Promise<EventTypes>((resolve)=>{
        defaults.database.ref('events')
            .orderByChild('uid')
            .equalTo(uid)
            .on('value',(snapshot:any)=>{
                const val = snapshot.val();
                resolve(val[Object.keys(val)[0]] || {});
            })
    }),
    getEvents : () => defaults.database.ref('events').once('value').then((snapshot:any)=>snapshot.val()),
    getEventsRange : (params:any):Promise<EventTypes[]> => new Promise<EventTypes[]>((resolve)=>{
        defaults.database.ref('events')
            .orderByChild('date')
            .startAt(params.startAt)
            .endAt(params.endAt)
            .on('value',(snapshot:any)=>{
                const val = snapshot.val();
                resolve(val ? Object.values(val) : []);
            })
    }),
}
