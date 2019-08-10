import firebase from 'firebase';
import axios from 'axios';

const firebaseConfig = {
    apiKey: "AIzaSyDvRrNzGnkLqo4-xWpMrJhJbh0ejImk-JA",
    authDomain: "nac-admin2.firebaseapp.com",
    databaseURL: "https://nac-admin2.firebaseio.com",
    projectId: "nac-admin2",
    storageBucket: "nac-admin2.appspot.com",
    messagingSenderId: "476472808109",
    appId: "1:476472808109:web:81b230abdee83d77"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const database = firebase.database();
const rootRef = database.ref();
const auth = firebase.auth();
const googleAuthProvider:any = new firebase.auth.GoogleAuthProvider();

axios.defaults.baseURL = 'https://nac-admin2.firebaseio.com/nac-admin2';
// axios.defaults.headers['content-type'] = 'application/json';

const arrayConvertToObj = (array:string[]):{[key:string]:any} =>
    array.reduce((obj:{[key:string]:any},item:string) =>{
        if(item){
            obj[item] = firebase.database.ServerValue.TIMESTAMP
        }
        return obj
},{});

const objConvertToArray = <VALUE>(object:{[key:string]:VALUE} ):IKeyAndValue<VALUE>[]=>{
    const VOarray:IKeyAndValue<VALUE>[] = [];

    if(object){
        for(let [key,value] of Object.entries(object)){
            VOarray.push({
                key,
                value,
            })
        }
    }
    
    return VOarray
}

export default {
    firebaseConfig,
    database,
    rootRef,
    auth,
    googleAuthProvider,
    firebase,
    axios,
    arrayConvertToObj,
    objConvertToArray
}