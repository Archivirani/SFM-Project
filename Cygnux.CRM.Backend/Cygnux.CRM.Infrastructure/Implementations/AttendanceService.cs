namespace Cygnux.CRM.Infrastructure.Implementations;

using Constants;
using Contracts;
using Cygnux.CRM.Infrastructure.Models.Response.Complaint;
using Dapper;
using Models.Response;
using System.Data;
internal class AttendanceService : IAttendanceService
{
    private readonly IDbConnection _dbConnection;

    public AttendanceService(IDbConnection dbConnection)
    {
        _dbConnection = dbConnection;
    }


    public async Task<CommonCreateResponse> AddAttendance(string jsonRequest)
    {
        var parameters = new DynamicParameters();
        parameters.Add("@jsonData", jsonRequest, DbType.String);

        return await _dbConnection.QueryFirstOrDefaultAsync<CommonCreateResponse>(
            StoredProcedureConstants.Usp_AddOrUpdate_Attendance,
            param: parameters,
            commandType: CommandType.StoredProcedure
        ) ?? new CommonCreateResponse();
    }

    public async Task<AttendanceResponse?> GetAttendancePunchInOut(string userId)
    {
        var parameters = new DynamicParameters();
        parameters.Add("@UserId", userId, DbType.String);

        return await _dbConnection.QueryFirstOrDefaultAsync<AttendanceResponse>(
            StoredProcedureConstants.usp_Get_AttendancePunchInOut,
            parameters,
            commandType: CommandType.StoredProcedure
        );
    }




}

