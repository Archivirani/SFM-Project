namespace Cygnux.CRM.Infrastructure.Contracts;

using Cygnux.CRM.Infrastructure.Models.Response.Complaint;
using Models.Response;

public interface IComplaintService
{
    //Task<IEnumerable<ComplaintResponse>> GetComplaintList(string filterJson);
    Task<IEnumerable<ComplaintResponseNew>> GetComplaintList(string filterJson, bool? export);
    Task<IEnumerable<dynamic>> ExportComplaint(string filterJson);

    
    Task<ComplaintResponseNew> GetComplaintDetails(Guid id);

    Task<CommonCreateResponse> AddComplaint(string addComplaintJson);

    Task<CommonCreateResponse> UpdateComplaint(Guid id, string updateComplaintJson);

    Task<CommonCreateResponse> DeleteComplaint(Guid id);

    Task<CommonCreateResponse> CloseComplaint(string jsonReq);

    Task<CommonCreateResponse> AddEscalated(string addEscalateddata);

    Task<GetUser> GetUserData(string userid);

    Task<GetDocumentData> GetDocumentData(string docNo);
    //Task<IEnumerable<Response_List>> GetComplaintCNT(DateTime StartDate, DateTime EndDate, string UserID);
    Task<IEnumerable<Response_List>> GetComCount(string? StartDate, string? EndDate, string UserID);

}