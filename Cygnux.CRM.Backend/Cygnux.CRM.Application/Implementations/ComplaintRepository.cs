namespace Cygnux.CRM.Application.Implementations;

using Contracts;
using Cygnux.CRM.Infrastructure.Models.Response.Complaint;
using Infrastructure.Contracts;
using Infrastructure.Models.Response;
using Models.Request;
using Newtonsoft.Json;
using System.Globalization;

internal class ComplaintRepository : IComplaintRepository
{
    private readonly IComplaintService _complaintService;

    public ComplaintRepository(IComplaintService ComplaintService)
    {
        _complaintService = ComplaintService;
    }

    public async Task<BaseResponse<IEnumerable<ComplaintResponseNew>>> GetComplaintList(Dictionary<string, string> filters, bool? export)
    {
        var response = await _complaintService.GetComplaintList(JsonConvert.SerializeObject(filters), export);

        return new BaseResponse<IEnumerable<ComplaintResponseNew>>(response, response.Select(x => x.TotalCount).FirstOrDefault());
    }

    public async Task<BaseResponse<IEnumerable<dynamic>>> ExportComplaint(Dictionary<string, string> filters)
    {
        var response = await _complaintService.ExportComplaint(JsonConvert.SerializeObject(filters));

        return new BaseResponse<IEnumerable<dynamic>>(response);
    }

    public async Task<BaseResponse<ComplaintResponseNew?>> GetComplaintDetails(Guid id)
    {
        var response = await _complaintService.GetComplaintDetails(id);
        return new BaseResponse<ComplaintResponseNew?>(response);
    }

    public async Task<BaseResponse<CommonCreateResponse>> AddComplaint(CreateComplaintReq createComplaintadd)
    {
        var response = await _complaintService.AddComplaint(JsonConvert.SerializeObject(createComplaintadd));

        return response.Status > 0 ? new BaseResponse<CommonCreateResponse>(response)
            : new BaseResponse<CommonCreateResponse>(new ErrorResponse { Message = response.Message });
    }

    public async Task<BaseResponse<CommonCreateResponse>> CloseComplaint(CreateComplaintCloseRequest createComplaintClose)
    {
        var response = await _complaintService.CloseComplaint(JsonConvert.SerializeObject(createComplaintClose));

        return response.Status > 0 ? new BaseResponse<CommonCreateResponse>(response)
            : new BaseResponse<CommonCreateResponse>(new ErrorResponse { Message = response.Message });
    }

    public async Task<BaseResponse<CommonCreateResponse>> UpdateComplaint(Guid id, CreateComplaintRequest createComplaint)
    {
        var response = await _complaintService.UpdateComplaint(id, JsonConvert.SerializeObject(createComplaint));

        return response.Status > 0 ? new BaseResponse<CommonCreateResponse>(response)
            : new BaseResponse<CommonCreateResponse>(new ErrorResponse { Message = response.Message });
    }

    public async Task<BaseResponse<CommonCreateResponse>> DeleteComplaint(Guid id)
    {
        var response = await _complaintService.DeleteComplaint(id);

        return response.Status > 0 ? new BaseResponse<CommonCreateResponse>(response)
            : new BaseResponse<CommonCreateResponse>(new ErrorResponse { Message = response.Message });
    }

    public async Task<BaseResponse<CommonCreateResponse>> AddEscalated(AddEscalatedReq addEscalateddata)
    {
        var response = await _complaintService.AddEscalated(JsonConvert.SerializeObject(addEscalateddata));

        return response.Status > 0 ? new BaseResponse<CommonCreateResponse>(response)
            : new BaseResponse<CommonCreateResponse>(new ErrorResponse { Message = response.Message });
    }
    public async Task<BaseResponse<GetUser?>> GetUser(string userid)
    {
        var response = await _complaintService.GetUserData(userid);
        return new BaseResponse<GetUser?>(response);
    }
    public async Task<BaseResponse<GetDocumentData?>> GetDocument(string docNo)
    {
        var response = await _complaintService.GetDocumentData(docNo);
        return new BaseResponse<GetDocumentData?>(response);
    }
    //public async Task<BaseResponse<IEnumerable<Response_List?>>> GetComplaintCNT(DateTime StartDate, DateTime EndDate, string UserID)
    //{
    //    var response = await _complaintService.GetComplaintCNT(StartDate, EndDate, UserID);
    //    return new BaseResponse<IEnumerable<Response_List?>>(response);

    //}
    public async Task<BaseResponse<IEnumerable<Response_List?>>> GetComCount(string? StartDate, string? EndDate, string UserID)
    {
        var response = await _complaintService.GetComCount(StartDate, EndDate, UserID);
        return new BaseResponse<IEnumerable<Response_List?>>(response);

    }

}