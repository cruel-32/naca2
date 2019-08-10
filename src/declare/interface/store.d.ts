declare interface IContentTypes {
    key:string;
    name:string;
}

declare interface IDateRange {
    startAt:number;
    endAt:number;
}

declare interface IEventTypes {
    key:string|null;
    date:number;
    title:string;
    placeKeys:string[];
    contentKeys:string[];
    memberKeys:string[];
}

declare interface IGradeTypes {
    key:string;
    grade:number;
    name:string;
    day:number;
}

declare interface IMemberTypes {
    key:string|null;
    address:string;
    birth:number;
    gender:string;
    grade:number
    joinDate:number
    mail:string;
    outDay:number
    participation:IKeyAndValue<number>[];
    firstDate:IKeyAndValue<number>;
    lastDate:IKeyAndValue<number>;
    phone:number;
    dPlus:number;
    dMinus:number;
    status:string;
    name:string;
    job:string;
}

declare interface IPlaceTypes {
    key:string;
    name:string;
}

declare interface ISideMenuTypes {
    icon:string;
    iconClass:string;
    title:string;
    subtitle:string;
    link:string;
    color:string;
}

declare interface ISnackbarTypes {
    time?:number;
    isShowSnackbar?:boolean;
    snackColor:string;
    snackText:string;
    key?:string;
}

declare interface IUserTypes {
    displayName:string;
    email:string;
    emailVerified?:boolean;
    providerData?:any[];
}