namespace Cygnux.CRM.Infrastructure.Implementations;

using Constants;
using Contracts;
using Cygnux.CRM.Infrastructure.Models.Response.Dashboard;
using Cygnux.CRM.Infrastructure.Models.Response.Lead;
using Dapper;
using Models.Response;
using System.Data;


internal class DashboardService : IDashboardService
{
    private readonly IDbConnection _dbConnection;

    public DashboardService(IDbConnection dbConnection)
    {
        _dbConnection = dbConnection;
    }

    public async Task<DashboardResponse> GetDashboard(string userid, DateTime? startdate, DateTime? enddate)
    {
        var parameters = new DynamicParameters();
        parameters.Add("@UserId", userid, DbType.String);
        parameters.Add("@StartDate", startdate, DbType.DateTime);
        parameters.Add("@EndDate", enddate, DbType.DateTime);

        return await _dbConnection.QueryFirstOrDefaultAsync<DashboardResponse>(
            StoredProcedureConstants.Usp_GetDashboard,
            param: parameters,
            commandType: CommandType.StoredProcedure
        ) ?? new DashboardResponse();
    }


    public async Task<LeadByStatusResponse> GetLeadByStatus(string userid, DateTime? startdate, DateTime? enddate)
    {
        var parameters = new DynamicParameters();
        parameters.Add("@UserId", userid, DbType.String);
        parameters.Add("@StartDate", startdate, DbType.DateTime);
        parameters.Add("@EndDate", enddate, DbType.DateTime);

        return await _dbConnection.QueryFirstOrDefaultAsync<LeadByStatusResponse>(
            StoredProcedureConstants.Usp_GetLeadByStatus,
            param: parameters,
            commandType: CommandType.StoredProcedure
        ) ?? new LeadByStatusResponse();
    }

    public async Task<List<LeadByCategoryResponse>> GetLeadByCategory(string userid, DateTime? startdate, DateTime? enddate)
    {
        var parameters = new DynamicParameters();
        parameters.Add("@UserId", userid, DbType.String);
        parameters.Add("@StartDate", startdate, DbType.DateTime);
        parameters.Add("@EndDate", enddate, DbType.DateTime);

        var result = await _dbConnection.QueryAsync<LeadByCategoryResponse>(
            StoredProcedureConstants.Usp_GetLeadByCategory,
            param: parameters,
            commandType: CommandType.StoredProcedure
        );

        return result.ToList();
    }

    public async Task<LeadBySourceResponse> GetLeadBySource(string userid, DateTime? startdate, DateTime? enddate)
    {
        var parameters = new DynamicParameters();
        parameters.Add("@UserId", userid, DbType.String);
        parameters.Add("@StartDate", startdate, DbType.DateTime);
        parameters.Add("@EndDate", enddate, DbType.DateTime);

        return await _dbConnection.QueryFirstOrDefaultAsync<LeadBySourceResponse>(
            StoredProcedureConstants.Usp_GetLeadBySource,
            param: parameters,
            commandType: CommandType.StoredProcedure
        ) ?? new LeadBySourceResponse();
    }



    public async Task<MeetingByStatusResponse> GetMeetingByStatus(string userid, DateTime? startdate, DateTime? enddate)
    {
        var parameters = new DynamicParameters();
        parameters.Add("@UserId", userid, DbType.String);
        parameters.Add("@StartDate", startdate, DbType.DateTime);
        parameters.Add("@EndDate", enddate, DbType.DateTime);

        return await _dbConnection.QueryFirstOrDefaultAsync<MeetingByStatusResponse>(
            StoredProcedureConstants.Usp_GetMeetingByStatus,
            param: parameters,
            commandType: CommandType.StoredProcedure
        ) ?? new MeetingByStatusResponse();
    }

    public async Task<List<MeetingCountDayWiseResponse>> GetMeetingCountDayWise(string userid, DateTime? startdate, DateTime? enddate)
    {
        var parameters = new DynamicParameters();
        parameters.Add("@UserId", userid, DbType.String);
        parameters.Add("@StartDate", startdate, DbType.DateTime);
        parameters.Add("@EndDate", enddate, DbType.DateTime);

        var result = await _dbConnection.QueryAsync<MeetingCountDayWiseResponse>(
            StoredProcedureConstants.Usp_GetMeetingCountDayWise,
            param: parameters,
            commandType: CommandType.StoredProcedure
        );

        return result.ToList();
    }

}

