namespace Cygnux.CRM.Infrastructure.Contracts;

using Cygnux.CRM.Infrastructure.Models.Response.Lead;
using Models.Response;

public interface ILeadService
{
    Task<IEnumerable<LeadResponse>> GetLeadList(string filterJson);
    Task<IEnumerable<dynamic>> ExportLead(string filterJson);

    Task<LeadDetailResponse> GetLeadDetails(Guid id);

    Task<CommonCreateResponse> AddLead(string addLeadJson);

    Task<CommonCreateResponse> ImportLead(string addLeadsJson);


    Task<CommonCreateResponse> UpdateLead(Guid id, string updateLeadJson);

    Task<CommonCreateResponse> DeleteLead(Guid id);
}