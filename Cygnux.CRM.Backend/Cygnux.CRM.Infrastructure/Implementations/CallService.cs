namespace Cygnux.CRM.Infrastructure.Implementations;

using Constants;
using Contracts;
using Cygnux.CRM.Infrastructure.Models.Response.Call;
using Dapper;
using Models.Response;
using System.Data;

internal class CallService : ICallService
{
    private readonly IDbConnection _dbConnection;

    public CallService(IDbConnection dbConnection)
    {
        _dbConnection = dbConnection;
    }

    public async Task<IEnumerable<CallResponse>> GetCallList(string filterJson)
    {
        var parameters = new DynamicParameters();
        parameters.Add("@FiltersJson", filterJson, DbType.String);

        return await _dbConnection.QueryAsync<CallResponse>(
             StoredProcedureConstants.Usp_GetCall,
             parameters,
             commandType: CommandType.StoredProcedure
         );
    }

    public async Task<IEnumerable<CallTotalResponse>> GetTotalCall()
    {
        return await _dbConnection.QueryAsync<CallTotalResponse>(
             StoredProcedureConstants.Usp_GetTotalCall,
             commandType: CommandType.StoredProcedure
         );
    }
    public async Task<IEnumerable<dynamic>> ExportCall(string filterJson)
    {
        var parameters = new DynamicParameters();
        parameters.Add("@FiltersJson", filterJson, DbType.String);
        parameters.Add("@Export", true, DbType.Boolean);

        return await _dbConnection.QueryAsync<dynamic>(
             StoredProcedureConstants.Usp_GetCall,
             parameters,
             commandType: CommandType.StoredProcedure
         );
    }

    public async Task<CallDetailResponse> GetCallDetails(Guid id)
    {
        var parameters = new DynamicParameters();
        parameters.Add("@Id", id, DbType.Guid);

        return await _dbConnection.QueryFirstOrDefaultAsync<CallDetailResponse>(
            StoredProcedureConstants.Usp_GetCall,
            param: parameters,
            commandType: CommandType.StoredProcedure
        ) ?? new CallDetailResponse();
    }

    public async Task<CommonCreateResponse> AddCall(string addCallJson)
    {
        var parameters = new DynamicParameters();
        parameters.Add("@CallJson", addCallJson, DbType.String);

        return await _dbConnection.QueryFirstOrDefaultAsync<CommonCreateResponse>(
            StoredProcedureConstants.Usp_Call,
            param: parameters,
            commandType: CommandType.StoredProcedure
        ) ?? new CommonCreateResponse();
    }

    public async Task<CommonCreateResponse> UpdateCall(Guid id, string updateCallJson)
    {
        var parameters = new DynamicParameters();
        parameters.Add("@CallJson", updateCallJson, DbType.String);
        parameters.Add("@Id", id, DbType.Guid);

        return await _dbConnection.QueryFirstOrDefaultAsync<CommonCreateResponse>(
            StoredProcedureConstants.Usp_Call,
            param: parameters,
            commandType: CommandType.StoredProcedure
        ) ?? new CommonCreateResponse();
    }

    public async Task<CommonCreateResponse> ImportCall(string addCallsJson)
    {
        var parameters = new DynamicParameters();
        parameters.Add("@CallJson", addCallsJson, DbType.String);

        return await _dbConnection.QueryFirstOrDefaultAsync<CommonCreateResponse>(
            StoredProcedureConstants.Usp_ImportCall,
            param: parameters,
            commandType: CommandType.StoredProcedure
        ) ?? new CommonCreateResponse();
    }
    public async Task<CommonCreateResponse> DeleteCall(Guid id)
    {
        var deleteQuery = "Update Calls Where IsActive = 0 Where CallId = @Id";
        var rowAffected = await _dbConnection.ExecuteAsync(deleteQuery, new { Id = id });
        if (rowAffected > 0)
        {
            return new CommonCreateResponse { Status = 1, Message = "Call deleted successfully" };
        }
        return new CommonCreateResponse();
    }
}