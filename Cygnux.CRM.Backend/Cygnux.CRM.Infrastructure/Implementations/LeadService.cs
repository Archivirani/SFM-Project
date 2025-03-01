namespace Cygnux.CRM.Infrastructure.Implementations;

using Constants;
using Contracts;
using Cygnux.CRM.Infrastructure.Models.Response.Lead;
using Dapper;
using Models.Response;
using System.Data;

internal class LeadService : ILeadService
{
    private readonly IDbConnection _dbConnection;

    public LeadService(IDbConnection dbConnection)
    {
        _dbConnection = dbConnection;
    }

    public async Task<IEnumerable<LeadResponse>> GetLeadList(string filterJson)
    {
        var parameters = new DynamicParameters();
        parameters.Add("@FiltersJson", filterJson, DbType.String);

        return await _dbConnection.QueryAsync<LeadResponse>(
             StoredProcedureConstants.Usp_GetLead,
             parameters,
             commandType: CommandType.StoredProcedure
         );
    }
    public async Task<IEnumerable<dynamic>> ExportLead(string filterJson)
    {
        var parameters = new DynamicParameters();
        parameters.Add("@FiltersJson", filterJson, DbType.String);
        parameters.Add("@Export", true, DbType.Boolean);

        return await _dbConnection.QueryAsync<dynamic>(
             StoredProcedureConstants.Usp_GetLead,
             parameters,
             commandType: CommandType.StoredProcedure
         );
    }
    public async Task<LeadDetailResponse> GetLeadDetails(Guid id)
    {
        var parameters = new DynamicParameters();
        parameters.Add("@Id", id, DbType.Guid);

        return await _dbConnection.QueryFirstOrDefaultAsync<LeadDetailResponse>(
            StoredProcedureConstants.Usp_GetLead,
            param: parameters,
            commandType: CommandType.StoredProcedure
        ) ?? new LeadDetailResponse();
    }

    public async Task<CommonCreateResponse> AddLead(string addLeadJson)
    {
        var parameters = new DynamicParameters();
        parameters.Add("@LeadJson", addLeadJson, DbType.String);

        return await _dbConnection.QueryFirstOrDefaultAsync<CommonCreateResponse>(
            StoredProcedureConstants.Usp_Lead,
            param: parameters,
            commandType: CommandType.StoredProcedure
        ) ?? new CommonCreateResponse();
    }

    public async Task<CommonCreateResponse> ImportLead(string addLeadsJson)
    {
        var parameters = new DynamicParameters();
        parameters.Add("@LeadJson", addLeadsJson, DbType.String);

        return await _dbConnection.QueryFirstOrDefaultAsync<CommonCreateResponse>(
            StoredProcedureConstants.Usp_ImportLead,
            param: parameters,
            commandType: CommandType.StoredProcedure
        ) ?? new CommonCreateResponse();
    }

    public async Task<CommonCreateResponse> UpdateLead(Guid id, string updateLeadJson)
    {
        var parameters = new DynamicParameters();
        parameters.Add("@LeadJson", updateLeadJson, DbType.String);
        parameters.Add("@Id", id, DbType.Guid);

        return await _dbConnection.QueryFirstOrDefaultAsync<CommonCreateResponse>(
            StoredProcedureConstants.Usp_Lead,
            param: parameters,
            commandType: CommandType.StoredProcedure
        ) ?? new CommonCreateResponse();
    }

    public async Task<CommonCreateResponse> DeleteLead(Guid id)
    {
        var deleteQuery = "Update Leads Where IsActive = 0 Where LeadId = @LeadMasterId";
        var rowAffected = await _dbConnection.ExecuteAsync(deleteQuery, new { Id = id });
        if (rowAffected > 0)
        {
            return new CommonCreateResponse { Status = 1, Message = "Lead deleted successfully" };
        }
        return new CommonCreateResponse();
    }
}