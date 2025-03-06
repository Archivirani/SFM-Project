export interface GeneralMasterResponseList {
        id: number,
        designationId: number,
        designation: string,
        transportModeId: number,
        transportMode:string,
        ratePerKM: number,
        createdBy:string,
        createdDate: string,
        modifiedBy: string,
        modifiedDate:string,
        isActive: boolean,
        totalCount: number
    }

    export interface GeneralMaster {
       codeType: string;
       codeId: string;
       codeDesc: string;
    }