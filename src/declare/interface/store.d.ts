declare interface ContentTypes {
    key:string;
    name?:string;
}

declare interface DateRange {
    startAt:number;
    endAt:number;
}

declare interface EventTypes {
    key:string|null;
    date:number;
    title:string;
    placeKeys:string[];
    contentKeys:string[];
    memberKeys:string[];
}

declare interface GradeTypes {
    key:string;
    grade:number;
    name:string;
    day:number;
}

declare interface MemberTypes {
    key:string|null;
    address:string;
    birth:number;
    gender:string;
    grade:number
    joinDate:number
    mail:string;
    outDay:number
    participation:any[];
    lastDate:KeyAndValue<number>;
    phone:number;
    dPlus:number;
    dMinus:number;
    status:string;
    name:string;
    job:string;
}

declare interface PlaceTypes {
    key:string;
    name:string;
}

declare interface SideMenuTypes {
    icon:string;
    iconClass:string;
    title:string;
    subtitle:string;
    link:string;
    color:string;
}

declare interface SnackbarTypes {
    time?:number;
    isShowSnackbar?:boolean;
    snackColor:string;
    snackText:string;
    key?:string;
}

declare interface UserTypes {
    displayName:string;
    email:string;
    emailVerified?:boolean;
    providerData?:any[];
}