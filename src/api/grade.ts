import API_UTILS from './API_UTILS';

export default {
    getGrades : () => API_UTILS.database.ref('grades').once('value').then((snapshots:any)=>{
        const grades:GradeTypes[] = [];
        snapshots.forEach((snapshot:any)=>{
            const child = snapshot.val();
            child.key = snapshot.key;
            grades.push(child);
        })
        return grades
    }),

}