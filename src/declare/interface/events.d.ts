declare interface DateRange {
    startAt:number;
    endAt:number;
}

declare interface EventTypes {
    key?:string;
    date:number;
    title:string;
    placeKeys:string[];
    contentKeys:string[];
    memberKeys:string[];
}