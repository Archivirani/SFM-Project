namespace Cygnux.CRM.Infrastructure.Implementations;

using Constants;
using Contracts;
using Cygnux.CRM.Infrastructure.Models.Response.Dashboard;
using Cygnux.CRM.Infrastructure.Models.Response.Meeting;
using Dapper;
using Models.Response;
using System.Data;

internal class MeetingService : IMeetingService
{
    private readonly IDbConnection _dbConnection;

    public MeetingService(IDbConnection dbConnection)
    {
        _dbConnection = dbConnection;
    }

    public async Task<IEnumerable<MeetingResponse>> GetMeetingList(string filterJson)
    {
        var parameters = new DynamicParameters();
        parameters.Add("@FiltersJson", filterJson, DbType.String);

        return await _dbConnection.QueryAsync<MeetingResponse>(
             StoredProcedureConstants.Usp_GetMeeting,
             parameters,
             commandType: CommandType.StoredProcedure
         );
    }

    public async Task<IEnumerable<dynamic>> ExportMeeting(string filterJson)
    {
        var parameters = new DynamicParameters();
        parameters.Add("@FiltersJson", filterJson, DbType.String);
        parameters.Add("@Export", true ,DbType.Boolean);

        return await _dbConnection.QueryAsync<dynamic>(
             StoredProcedureConstants.Usp_GetMeeting,
             parameters,
             commandType: CommandType.StoredProcedure
         );
    }

    public async Task<MeetingDetailResponse> GetMeetingDetails(Guid id)
    {
        var parameters = new DynamicParameters();
        parameters.Add("@Id", id, DbType.Guid);

        return await _dbConnection.QueryFirstOrDefaultAsync<MeetingDetailResponse>(
            StoredProcedureConstants.Usp_GetMeeting,
            param: parameters,
            commandType: CommandType.StoredProcedure
        ) ?? new MeetingDetailResponse();
    }

    public async Task<CommonCreateResponse> AddMeeting(string addMeetingJson)
    {
        var parameters = new DynamicParameters();
        parameters.Add("@MeetingJson", addMeetingJson, DbType.String);

        return await _dbConnection.QueryFirstOrDefaultAsync<CommonCreateResponse>(
            StoredProcedureConstants.Usp_Meeting,
            param: parameters,
            commandType: CommandType.StoredProcedure
        ) ?? new CommonCreateResponse();
    }

    public async Task<CommonCreateResponse> AddCheckIn(string meetingCheckInJson)
    {
        var parameters = new DynamicParameters();
        parameters.Add("@MeetingCheckInJson", meetingCheckInJson, DbType.String);

        return await _dbConnection.QueryFirstOrDefaultAsync<CommonCreateResponse>(
            StoredProcedureConstants.Usp_MeetingCheckIn,
            param: parameters,
            commandType: CommandType.StoredProcedure
        ) ?? new CommonCreateResponse();
    }

    public async Task<CommonCreateResponse> UpdateMeeting(Guid id, string updateMeetingJson)
    {
        var parameters = new DynamicParameters();
        parameters.Add("@MeetingJson", updateMeetingJson, DbType.String);
        parameters.Add("@Id", id, DbType.Guid);

        return await _dbConnection.QueryFirstOrDefaultAsync<CommonCreateResponse>(
            StoredProcedureConstants.Usp_Meeting,
            param: parameters,
            commandType: CommandType.StoredProcedure
        ) ?? new CommonCreateResponse();
    }

    public async Task<CommonCreateResponse> DeleteMeeting(Guid id)
    {
        var deleteQuery = "Update Meetings Where IsActive = 0 Where MeetingId = @Id";
        var rowAffected = await _dbConnection.ExecuteAsync(deleteQuery, new { Id = id });
        if (rowAffected > 0)
        {
            return new CommonCreateResponse { Status = 1, Message = "Meeting deleted successfully" };
        }
        return new CommonCreateResponse();
    }



    public async Task<List<MoMListResponse>> GetMoMList()
    {
        var result = await _dbConnection.QueryAsync<MoMListResponse>(
            StoredProcedureConstants.Usp_MoMs,
            commandType: CommandType.StoredProcedure
        );

        return result.ToList();
    }



    public async Task<CommonCreateResponse> MeetingCheckInOut(string jsonData)
    {
        var parameters = new DynamicParameters();
        parameters.Add("@jsonData", jsonData, DbType.String);

        return await _dbConnection.QueryFirstOrDefaultAsync<CommonCreateResponse>(
            StoredProcedureConstants.Usp_AddMeetingCheckInOut,
            param: parameters,
            commandType: CommandType.StoredProcedure
        ) ?? new CommonCreateResponse();
    }


}