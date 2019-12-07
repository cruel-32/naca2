interface IContentTypes {
    key:string;
    name:string;
}

interface IDateRange {
    startAt:number;
    endAt:number;
}

interface IEventTypes {
    key:string|null;
    date:number;
    title:string;
    placeKeys:IPlaceTypes['key'][];
    contentKeys:IContentTypes['key'][];
    memberKeys:NonNullable<IMemberTypes['key']>[];
}

interface IGradeTypes {
    key:string;
    grade:number;
    name:string;
    day:number;
}

interface IMemberTypes {
    key:string|null;
    // address:string;
    birth:number;
    gender:string;
    grade:IGradeTypes['grade'];
    joinDate:number
    mail:string;
    outDay:number
    participation:IKeyAndValue<NonNullable<IEventTypes['key']>>[];
    firstDate:IKeyAndValue<number>;
    lastDate:IKeyAndValue<number>;
    phone:number;
    dPlus:number;
    dMinus:number;
    status:string;
    name:string;
    hobbys:string[];
    // job:string;
}

interface IPlaceTypes {
    key:string;
    name:string;
}

interface ISideMenuTypes {
    icon:string;
    iconClass:string;
    title:string;
    subtitle:string;
    link:string;
    color:string;
}

interface ISnackbarTypes {
    time?:number;
    isShowSnackbar?:boolean;
    snackColor:string;
    snackText:string;
    key?:string;
}

interface IUserTypes {
    displayName:string;
    email:string;
    emailVerified?:boolean;
    providerData?:any[];
}