import defaults from './defaults';

export default {
    signInGoogle():any {
        return defaults.auth.signInWithPopup(defaults.googleAuthProvider).then(result=>result);
    },
    signOut():any {
        return defaults.auth.signOut().then(result=>result);
    }
}