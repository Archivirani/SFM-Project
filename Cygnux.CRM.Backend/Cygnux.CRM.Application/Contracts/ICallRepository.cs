namespace Cygnux.CRM.Application.Contracts;

using Cygnux.CRM.Infrastructure.Models.Response.Call;
using Infrastructure.Models.Response;
using Models.Request;

public interface ICallRepository
{
    Task<BaseResponse<IEnumerable<CallResponse>>> GetCallList(Dictionary<string, string> filters);
    Task<BaseResponse<IEnumerable<dynamic>>> ExportCall(Dictionary<string, string> filters);

    Task<BaseResponse<IEnumerable<CallTotalResponse>>> GetTotalCall();
    Task<BaseResponse<CallDetailResponse?>> GetCallDetails(Guid id);

    Task<BaseResponse<CommonCreateResponse>> AddCall(CreateCallRequest createCall);

    Task<BaseResponse<CommonCreateResponse>> UpdateCall(Guid id, CreateCallRequest createCall);

    Task<BaseResponse<CommonCreateResponse>> ImportCall(string createCalls);


    Task<BaseResponse<CommonCreateResponse>> DeleteCall(Guid id);
}