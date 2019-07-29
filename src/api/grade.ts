import API_UTILS from './API_UTILS';

export default {
    getGrades : () => API_UTILS.database.ref('grades').once('value').then((snapshot:any)=>{
        const grades:GradeTypes[] = [];
        snapshot.forEach((sn:any)=>{
            const child = sn.val();
            child.key = sn.key;
            grades.push(child);
        })
        return grades
    }),

}