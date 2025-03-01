namespace Cygnux.CRM.Application.Contracts;

using Cygnux.CRM.Infrastructure.Models.Response.Lead;
using Infrastructure.Models.Response;
using Models.Request;

public interface ILeadRepository
{
    Task<BaseResponse<IEnumerable<LeadResponse>>> GetLeadList(Dictionary<string, string> filters);
    Task<BaseResponse<IEnumerable<dynamic>>> ExportLead(Dictionary<string, string> filters);

    Task<BaseResponse<LeadDetailResponse?>> GetLeadDetails(Guid id);

    Task<BaseResponse<CommonCreateResponse>> AddLead(CreateLeadRequest createLead);

    //Task<BaseResponse<CommonCreateResponse>> ImportLead(List<Dictionary<string, string>> createLeads);
    Task<BaseResponse<CommonCreateResponse>> ImportLead(string createLeads);


    Task<BaseResponse<CommonCreateResponse>> UpdateLead(Guid id, CreateLeadRequest createLead);

    Task<BaseResponse<CommonCreateResponse>> DeleteLead(Guid id);
}