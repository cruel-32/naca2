import defaults from './defaults';

export default {
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
