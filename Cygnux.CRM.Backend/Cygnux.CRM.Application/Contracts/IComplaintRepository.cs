namespace Cygnux.CRM.Application.Contracts;

using Cygnux.CRM.Infrastructure.Models.Response.Complaint;
using Infrastructure.Models.Response;
using Models.Request;
using System.Globalization;

public interface IComplaintRepository
{
    Task<BaseResponse<IEnumerable<ComplaintResponseNew>>> GetComplaintList(Dictionary<string, string> filters, bool? export);

    Task<BaseResponse<IEnumerable<dynamic>>> ExportComplaint(Dictionary<string, string> filters);

    Task<BaseResponse<ComplaintResponseNew?>> GetComplaintDetails(Guid id);

    Task<BaseResponse<CommonCreateResponse>> AddComplaint(CreateComplaintReq createComplaintadd);

    Task<BaseResponse<CommonCreateResponse>> UpdateComplaint(Guid id, CreateComplaintRequest createComplaint);

    Task<BaseResponse<CommonCreateResponse>> DeleteComplaint(Guid id);

    Task<BaseResponse<CommonCreateResponse>> CloseComplaint(CreateComplaintCloseRequest createComplaintClose);

    Task<BaseResponse<CommonCreateResponse>> AddEscalated(AddEscalatedReq addEscalateddata);

    Task<BaseResponse<GetUser?>> GetUser(string userid);

    Task<BaseResponse<GetDocumentData?>> GetDocument(string docNo);
   // Task<BaseResponse<IEnumerable<Response_List?>>> GetComplaintCNT(DateTime StartDate, DateTime EndDate, string UserID);

    Task<BaseResponse<IEnumerable<Response_List?>>> GetComCount(string? StartDate, string? EndDate, string UserID);

}