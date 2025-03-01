namespace Cygnux.CRM.Infrastructure.Contracts;

using Cygnux.CRM.Infrastructure.Models.Response.Meeting;
using Models.Response;

public interface IMeetingService
{
    Task<IEnumerable<MeetingResponse>> GetMeetingList(string filterJson);
    Task<IEnumerable<object>> ExportMeeting(string filterJson);


    Task<MeetingDetailResponse> GetMeetingDetails(Guid id);

    Task<CommonCreateResponse> AddMeeting(string addMeetingJson);

    Task<CommonCreateResponse> AddCheckIn(string meetingCheckInJson);


    Task<CommonCreateResponse> UpdateMeeting(Guid id, string updateMeetingJson);

    Task<CommonCreateResponse> DeleteMeeting(Guid id);

    Task<List<MoMListResponse>> GetMoMList();

    Task<CommonCreateResponse> MeetingCheckInOut(string jsonData);
}