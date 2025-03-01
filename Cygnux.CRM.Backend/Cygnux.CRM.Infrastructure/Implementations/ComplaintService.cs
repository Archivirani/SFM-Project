namespace Cygnux.CRM.Infrastructure.Implementations;

using Constants;
using Contracts;
using Cygnux.CRM.Infrastructure.Models.Response.Complaint;
using Dapper;
using Models.Response;
using System.Data;

internal class ComplaintService : IComplaintService
{
    private readonly IDbConnection _dbConnection;

    public ComplaintService(IDbConnection dbConnection)
    {
        _dbConnection = dbConnection;
    }

    //public async Task<IEnumerable<ComplaintResponse>> GetComplaintList(string filterJson)
    //{
    //    var parameters = new DynamicParameters();
    //    parameters.Add("@FiltersJson", filterJson, DbType.String);

    //    return await _dbConnection.QueryAsync<ComplaintResponse>(
    //         StoredProcedureConstants.Usp_GetComplaint,
    //         parameters,
    //         commandType: CommandType.StoredProcedure
    //     );
    //}


    /*public async Task<IEnumerable<ComplaintResponseNew>> GetComplaintList(string filterJson, bool? export)
    {
        var parameters = new DynamicParameters();
        parameters.Add("@FiltersJson", filterJson, DbType.String);

        return await _dbConnection.QueryAsync<ComplaintResponseNew>(
             StoredProcedureConstants.Usp_Get_Complaint,
             parameters,
             commandType: CommandType.StoredProcedure
         );
    }*/

    public async Task<IEnumerable<ComplaintResponseNew>> GetComplaintList(string filterJson, bool? export)
        {
        var parameters = new DynamicParameters();
        parameters.Add("@ComplaintID", null, DbType.Guid);
        parameters.Add("@FiltersJson", filterJson, DbType.String);
        parameters.Add("@Export", export, DbType.Boolean);

        return await _dbConnection.QueryAsync<ComplaintResponseNew>(
             StoredProcedureConstants.Usp_Get_Complaint,
             parameters,
             commandType: CommandType.StoredProcedure
         );
    }

    public async Task<IEnumerable<dynamic>> ExportComplaint(string filterJson)
    {
        var parameters = new DynamicParameters();
        parameters.Add("@FiltersJson", filterJson, DbType.String);
        parameters.Add("@Export", true, DbType.Boolean);

        return await _dbConnection.QueryAsync<dynamic>(
             StoredProcedureConstants.Usp_GetComplaint,
             parameters,
             commandType: CommandType.StoredProcedure
         );
    }

    public async Task<ComplaintResponseNew> GetComplaintDetails(Guid id)
    {
        var parameters = new DynamicParameters();
        parameters.Add("@ComplaintID", id, DbType.Guid);
        parameters.Add("@FiltersJson", null, DbType.String);
        parameters.Add("@Export", false, DbType.Boolean);


        return await _dbConnection.QueryFirstOrDefaultAsync<ComplaintResponseNew>(
            StoredProcedureConstants.Usp_Get_Complaint,
            param: parameters,
            commandType: CommandType.StoredProcedure
        ) ?? new ComplaintResponseNew();
    }

    /*public async Task<ComplaintDetailResponse> GetComplaintDetails(Guid id)
    {
        var parameters = new DynamicParameters();
        parameters.Add("@Id", id, DbType.Guid);

        return await _dbConnection.QueryFirstOrDefaultAsync<ComplaintDetailResponse>(
            StoredProcedureConstants.Usp_GetComplaint,
            param: parameters,
            commandType: CommandType.StoredProcedure
        ) ?? new ComplaintDetailResponse();
    }*/

    public async Task<CommonCreateResponse> AddComplaint(string addComplaintJson)
    {
        var parameters = new DynamicParameters();
        parameters.Add("@jsonData", addComplaintJson, DbType.String);

        return await _dbConnection.QueryFirstOrDefaultAsync<CommonCreateResponse>(
            StoredProcedureConstants.Usp_Add_Complaint, // Usp_Complaint,
            param: parameters,
            commandType: CommandType.StoredProcedure
        ) ?? new CommonCreateResponse();
    }


    public async Task<CommonCreateResponse> CloseComplaint(string jsonReq)
    {
        var parameters = new DynamicParameters();
        parameters.Add("@jsonData", jsonReq, DbType.String);

        return await _dbConnection.QueryFirstOrDefaultAsync<CommonCreateResponse>(
            StoredProcedureConstants.Usp_Close_Complaint, // Usp_Complaint,
            param: parameters,
            commandType: CommandType.StoredProcedure
        ) ?? new CommonCreateResponse();
    }


    public async Task<CommonCreateResponse> UpdateComplaint(Guid id, string updateComplaintJson)
    {
        var parameters = new DynamicParameters();
        parameters.Add("@UPDjson", updateComplaintJson, DbType.String);
        parameters.Add("@Id", id, DbType.Guid);

        return await _dbConnection.QueryFirstOrDefaultAsync<CommonCreateResponse>(
            StoredProcedureConstants.USP_UpdateComplaint,
            param: parameters,
            commandType: CommandType.StoredProcedure
        ) ?? new CommonCreateResponse();
    }

    public async Task<CommonCreateResponse> DeleteComplaint(Guid id)
    {
        var deleteQuery = "Update Complaint SET IsActive = 0,ComStatus = 4 Where ComplaintId = @Id";
        var rowAffected = await _dbConnection.ExecuteAsync(deleteQuery, new { Id = id });
        if (rowAffected > 0)
        {
            return new CommonCreateResponse { Status = 1, Message = "Complain deleted successfully" };
        }
        return new CommonCreateResponse();
    }

    public async Task<CommonCreateResponse> AddEscalated(string addEscalateddata)
        {
        var parameters = new DynamicParameters();
        parameters.Add("@jsonData", addEscalateddata, DbType.String);

        return await _dbConnection.QueryFirstOrDefaultAsync<CommonCreateResponse>(
            StoredProcedureConstants.usp_Add_Escalated, 
            param: parameters,
            commandType: CommandType.StoredProcedure
        ) ?? new CommonCreateResponse();
    }

    public async Task<GetUser> GetUserData(string userid)
    {
        var parameters = new DynamicParameters();
        parameters.Add("@userid", userid, DbType.String);

        return await _dbConnection.QueryFirstOrDefaultAsync<GetUser>(
            StoredProcedureConstants.Usp_GetUser,
            param: parameters,
            commandType: CommandType.StoredProcedure
        ) ?? new GetUser();
    }

    public async Task<GetDocumentData> GetDocumentData(string docNo)
    {
        var parameters = new DynamicParameters();
        parameters.Add("@docNo", docNo, DbType.String);

        return await _dbConnection.QueryFirstOrDefaultAsync<GetDocumentData>(
            StoredProcedureConstants.Usp_GetDocData,
            param: parameters,
            commandType: CommandType.StoredProcedure
        ) ?? new GetDocumentData();
    }

    //public async Task<IEnumerable<Response_List>> GetComplaintCNT(DateTime StartDate, DateTime EndDate, string UserID)
    //{
    //    var parameters = new DynamicParameters();
    //    parameters.Add("@StartDate", StartDate, DbType.DateTime);
    //    parameters.Add("@EndDate", EndDate, DbType.DateTime);
    //    parameters.Add("@UserID", UserID, DbType.String);

    //    return await _dbConnection.QueryAsync<Response_List>(
    //         StoredProcedureConstants.Usp_Get_Complaint_Count,
    //         parameters,
    //         commandType: CommandType.StoredProcedure
    //     );
    //}

    public async Task<IEnumerable<Response_List>> GetComCount(string? StartDate, string? EndDate, string UserID)
    {
        var parameters = new DynamicParameters();
        parameters.Add("@UserID", UserID, DbType.String);
        parameters.Add("@StartDate", StartDate, DbType.String);
        parameters.Add("@EndDate", EndDate, DbType.String);

        return await _dbConnection.QueryAsync<Response_List>(
             StoredProcedureConstants.Usp_Get_ComplaintCnt,
             parameters,
             commandType: CommandType.StoredProcedure
         );
    }

}