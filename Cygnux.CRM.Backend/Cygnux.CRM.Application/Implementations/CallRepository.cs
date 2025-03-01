namespace Cygnux.CRM.Application.Implementations;

using Contracts;
using Cygnux.CRM.Infrastructure.Models.Response.Call;
using Infrastructure.Contracts;
using Infrastructure.Models.Response;
using Models.Request;
using Newtonsoft.Json;

internal class CallRepository : ICallRepository
{
    private readonly ICallService _callService;

    public CallRepository(ICallService callService)
    {
        _callService = callService;
    }

    public async Task<BaseResponse<IEnumerable<CallResponse>>> GetCallList(Dictionary<string, string> filters)
    {
        var response = await _callService.GetCallList(JsonConvert.SerializeObject(filters));

        return new BaseResponse<IEnumerable<CallResponse>>(response, response.Select(x=>x.TotalCount).FirstOrDefault());
    }
    public async Task<BaseResponse<IEnumerable<CallTotalResponse>>> GetTotalCall()
    {
        var response = await _callService.GetTotalCall();

        return new BaseResponse<IEnumerable<CallTotalResponse>>(response, response.Sum(x => x.TotalCount));
    }
    public async Task<BaseResponse<IEnumerable<dynamic>>> ExportCall(Dictionary<string, string> filters)
    {
        var response = await _callService.ExportCall(JsonConvert.SerializeObject(filters));

        return new BaseResponse<IEnumerable<dynamic>>(response);
    }

    public async Task<BaseResponse<CallDetailResponse?>> GetCallDetails(Guid id)
    {
        var response = await _callService.GetCallDetails(id);
        return new BaseResponse<CallDetailResponse?>(response);
    }

    public async Task<BaseResponse<CommonCreateResponse>> AddCall(CreateCallRequest createCall)
    {
        var response = await _callService.AddCall(JsonConvert.SerializeObject(createCall));

        return response.Status > 0 ? new BaseResponse<CommonCreateResponse>(response)
            : new BaseResponse<CommonCreateResponse>(new ErrorResponse { Message = response.Message });
    }

    public async Task<BaseResponse<CommonCreateResponse>> UpdateCall(Guid id, CreateCallRequest createCall)
    {
        var response = await _callService.UpdateCall(id, JsonConvert.SerializeObject(createCall));

        return response.Status > 0 ? new BaseResponse<CommonCreateResponse>(response)
            : new BaseResponse<CommonCreateResponse>(new ErrorResponse { Message = response.Message });
    }
    public async Task<BaseResponse<CommonCreateResponse>> ImportCall(string createCalls)
    {
        var response = await _callService.ImportCall(JsonConvert.SerializeObject(createCalls));

        return response.Status > 0 ? new BaseResponse<CommonCreateResponse>(response)
            : new BaseResponse<CommonCreateResponse>(new ErrorResponse { Message = response.Message });
    }
    public async Task<BaseResponse<CommonCreateResponse>> DeleteCall(Guid id)
    {
        var response = await _callService.DeleteCall(id);

        return response.Status > 0 ? new BaseResponse<CommonCreateResponse>(response)
            : new BaseResponse<CommonCreateResponse>(new ErrorResponse { Message = response.Message });
    }
}