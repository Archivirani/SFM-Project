namespace Cygnux.CRM.Application.Contracts;

using Cygnux.CRM.Application.Models.Request.Meeting;
using Cygnux.CRM.Infrastructure.Models.Response.Meeting;
using Infrastructure.Models.Response;
using Models.Request;

public interface IMeetingRepository
{
    Task<BaseResponse<IEnumerable<MeetingResponse>>> GetMeetingList(Dictionary<string, string> filters);

    Task<BaseResponse<IEnumerable<dynamic>>> ExportMeeting(Dictionary<string, string> filters);

    Task<BaseResponse<MeetingDetailResponse?>> GetMeetingDetails(Guid id);

    Task<BaseResponse<CommonCreateResponse>> AddMeeting(CreateMeetingRequest createMeeting);

    Task<BaseResponse<CommonCreateResponse>> AddCheckIn(MeetingCheckInRequest meetingCheckInRequest);


    Task<BaseResponse<CommonCreateResponse>> UpdateMeeting(Guid id, CreateMeetingRequest createMeeting);

    Task<BaseResponse<CommonCreateResponse>> DeleteMeeting(Guid id);

    Task<BaseResponse<List<MoMListResponse>?>> GetMoMList();

    Task<BaseResponse<CommonCreateResponse>> MeetingCheckInOut(CreateMeetingCheckInOutRequest jsonReq);
}