export interface AttendanceRequest{
    userID: string,
    date: string,
    punchIn: string,
    punchInLat: number,
    punchInLng: number,
    punchOut: string,
    punchOutLat: number,
    punchOutLng: number,
    formattedDate: string,
    formattedPunchIn: string,
    formattedPunchOut: string
}

export interface AttendanceResponse{
    message:string;
    status:number;
}

export interface AttendanceCardResponse{
        totalComCount:number,
        new: number,
        escalated:number,
        closed:number,
        deleted:number,
        updatednumber:number
}