namespace Cygnux.CRM.Infrastructure.Contracts;

using Cygnux.CRM.Infrastructure.Models.Response.Call;
using Models.Response;

public interface ICallService
{
    Task<IEnumerable<CallResponse>> GetCallList(string filterJson);
    Task<IEnumerable<CallTotalResponse>> GetTotalCall();

    Task<IEnumerable<dynamic>> ExportCall(string filterJson);


    Task<CallDetailResponse> GetCallDetails(Guid id);

    Task<CommonCreateResponse> AddCall(string addCallJson);

    Task<CommonCreateResponse> UpdateCall(Guid id, string updateCallJson);

    Task<CommonCreateResponse> ImportCall(string addCallsJson);


    Task<CommonCreateResponse> DeleteCall(Guid id);
}