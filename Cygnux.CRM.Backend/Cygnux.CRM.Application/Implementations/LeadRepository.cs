namespace Cygnux.CRM.Application.Implementations;

using Contracts;
using Cygnux.CRM.Infrastructure.Models.Response.Lead;
using Infrastructure.Contracts;
using Infrastructure.Models.Response;
using Models.Request;
using Newtonsoft.Json;

internal class LeadRepository : ILeadRepository
{
    private readonly ILeadService _leadService;

    public LeadRepository(ILeadService LeadService)
    {
        _leadService = LeadService;
    }

    public async Task<BaseResponse<IEnumerable<LeadResponse>>> GetLeadList(Dictionary<string, string> filters)
    {
        var response = await _leadService.GetLeadList(JsonConvert.SerializeObject(filters));
       
        return new BaseResponse<IEnumerable<LeadResponse>>(response, response.Select(x => x.TotalCount).FirstOrDefault());
    }
    public async Task<BaseResponse<IEnumerable<dynamic>>> ExportLead(Dictionary<string, string> filters)
    {
        var response = await _leadService.ExportLead(JsonConvert.SerializeObject(filters));

        return new BaseResponse<IEnumerable<dynamic>>(response, response.Select(x => x.TotalCount).FirstOrDefault());
    }

    public async Task<BaseResponse<LeadDetailResponse?>> GetLeadDetails(Guid id)
    {
        var response = await _leadService.GetLeadDetails(id);

        return new BaseResponse<LeadDetailResponse?>(response);
    }

    public async Task<BaseResponse<CommonCreateResponse>> AddLead(CreateLeadRequest createLead)
    {
        var response = await _leadService.AddLead(JsonConvert.SerializeObject(createLead));

        return response.Status > 0 ? new BaseResponse<CommonCreateResponse>(response)
            : new BaseResponse<CommonCreateResponse>(new ErrorResponse { Message = response.Message });
    }

    public async Task<BaseResponse<CommonCreateResponse>> ImportLead(string createLeads)
    {
        //var response = await _leadService.ImportLead(JsonConvert.SerializeObject(createLeads));
        var response = await _leadService.ImportLead(createLeads);
        return response.Status > 0 ? new BaseResponse<CommonCreateResponse>(response)
            : new BaseResponse<CommonCreateResponse>(new ErrorResponse { Message = response.Message });
    }

    public async Task<BaseResponse<CommonCreateResponse>> UpdateLead(Guid id, CreateLeadRequest createLead)
    {
        var response = await _leadService.UpdateLead(id, JsonConvert.SerializeObject(createLead));

        return response.Status > 0 ? new BaseResponse<CommonCreateResponse>(response)
            : new BaseResponse<CommonCreateResponse>(new ErrorResponse { Message = response.Message });
    }

    public async Task<BaseResponse<CommonCreateResponse>> DeleteLead(Guid id)
    {
        var response = await _leadService.DeleteLead(id);

        return response.Status > 0 ? new BaseResponse<CommonCreateResponse>(response)
            : new BaseResponse<CommonCreateResponse>(new ErrorResponse { Message = response.Message });
    }
}