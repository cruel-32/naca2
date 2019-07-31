import API_UTILS from '@/utils/API_UTILS';

export default {
    signInGoogle():any {
        return API_UTILS.auth.signInWithPopup(API_UTILS.googleAuthProvider).then((result:any)=>result);
    },
    signOut():any {
        return API_UTILS.auth.signOut().then((result:any)=>result);
    },
}