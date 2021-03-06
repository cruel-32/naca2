import API_UTILS from '@/utils/API_UTILS';

export default {
    getGrades : ():Promise<IGradeTypes[]> => API_UTILS.database.ref('grades').once('value').then((snapshots:any)=>{
        const grades:IGradeTypes[] = [];
        snapshots.forEach((snapshot:any)=>{
            const child = snapshot.val();
            child.key = snapshot.key;
            grades.push(child);
        })
        return grades
    }),

}