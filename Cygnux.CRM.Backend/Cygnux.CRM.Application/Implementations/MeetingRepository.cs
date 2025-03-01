namespace Cygnux.CRM.Application.Implementations;

using Contracts;
using Cygnux.CRM.Application.Models.Request.Meeting;
using Cygnux.CRM.Infrastructure.Models.Response.Dashboard;
using Cygnux.CRM.Infrastructure.Models.Response.Meeting;
using Infrastructure.Contracts;
using Infrastructure.Models.Response;
using Models.Request;
using Newtonsoft.Json;

internal class MeetingRepository : IMeetingRepository
{
    private readonly IMeetingService _meetingService;

    public MeetingRepository(IMeetingService MeetingService)
    {
        _meetingService = MeetingService;
    }

    public async Task<BaseResponse<IEnumerable<MeetingResponse>>> GetMeetingList(Dictionary<string, string> filters)
    {
        var response = await _meetingService.GetMeetingList(JsonConvert.SerializeObject(filters));

        return new BaseResponse<IEnumerable<MeetingResponse>>(response, response.Select(x => x.TotalCount).FirstOrDefault());
    }
    public async Task<BaseResponse<IEnumerable<dynamic>>> ExportMeeting(Dictionary<string, string> filters)
    {
        var response = await _meetingService.ExportMeeting(JsonConvert.SerializeObject(filters));

        return new BaseResponse<IEnumerable<dynamic>>(response, 1);
    }

    public async Task<BaseResponse<MeetingDetailResponse?>> GetMeetingDetails(Guid id)
    {
        var response = await _meetingService.GetMeetingDetails(id);
        return new BaseResponse<MeetingDetailResponse?>(response);
    }

    public async Task<BaseResponse<CommonCreateResponse>> AddMeeting(CreateMeetingRequest createMeeting)
    {
        var response = await _meetingService.AddMeeting(JsonConvert.SerializeObject(createMeeting));

        return response.Status > 0 ? new BaseResponse<CommonCreateResponse>(response)
            : new BaseResponse<CommonCreateResponse>(new ErrorResponse { Message = response.Message });
    }

    public async Task<BaseResponse<CommonCreateResponse>> AddCheckIn(MeetingCheckInRequest meetingCheckInRequest)
    {
        var response = await _meetingService.AddCheckIn(JsonConvert.SerializeObject(meetingCheckInRequest));

        return response.Status > 0 ? new BaseResponse<CommonCreateResponse>(response)
            : new BaseResponse<CommonCreateResponse>(new ErrorResponse { Message = response.Message });
    }

    public async Task<BaseResponse<CommonCreateResponse>> UpdateMeeting(Guid id, CreateMeetingRequest createMeeting)
    {
        var response = await _meetingService.UpdateMeeting(id, JsonConvert.SerializeObject(createMeeting));

        return response.Status > 0 ? new BaseResponse<CommonCreateResponse>(response)
            : new BaseResponse<CommonCreateResponse>(new ErrorResponse { Message = response.Message });
    }

    public async Task<BaseResponse<CommonCreateResponse>> DeleteMeeting(Guid id)
    {
        var response = await _meetingService.DeleteMeeting(id);

        return response.Status > 0 ? new BaseResponse<CommonCreateResponse>(response)
            : new BaseResponse<CommonCreateResponse>(new ErrorResponse { Message = response.Message });
    }

    public async Task<BaseResponse<List<MoMListResponse>?>> GetMoMList()
    {
        var response = await _meetingService.GetMoMList();

        return new BaseResponse<List<MoMListResponse>?>(response);
    }

    public async Task<BaseResponse<CommonCreateResponse>> MeetingCheckInOut(CreateMeetingCheckInOutRequest jsonReq)
    {
        var response = await _meetingService.MeetingCheckInOut(JsonConvert.SerializeObject(jsonReq));

        return response.Status > 0 ? new BaseResponse<CommonCreateResponse>(response)
            : new BaseResponse<CommonCreateResponse>(new ErrorResponse { Message = response.Message });
    }


}