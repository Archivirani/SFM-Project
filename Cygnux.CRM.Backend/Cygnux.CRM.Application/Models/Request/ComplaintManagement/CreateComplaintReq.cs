using Cygnux.CRM.Application.Helpers;
using Cygnux.CRM.Infrastructure.Implementations;
using System.Runtime.InteropServices.Marshalling;

namespace Cygnux.CRM.Application.Models.Request;

public class CreateComplaintReq //: UserSettings
{
    //public string ComplaintCode { get; set; } = string.Empty;

    //private string _complaintDate = string.Empty;
    //public string ComplaintDate
    //{
    //    get => _complaintDate;
    //    set => _complaintDate = DateHelper.FormatDate(value);
    //}
    public string UserID { get; set; } = string.Empty;
    public string DocumentNo { get; set; } = string.Empty;
    public string ticketAddressTo { get; set; } = string.Empty;
    public string current { get; set; } = string.Empty;
    public int Source { get; set; }
    public required string complaintDate { get; set; }
    public int Type { get; set; }
    public int SubType { get; set; }
    public int Priority { get; set; }
    public string Description { get; set; } = string.Empty;

    //public string CustomerID { get; set; } = string.Empty;
    public string CustomerEmail { get; set; } = string.Empty;
    public string AssignedTo { get; set; } = string.Empty;
    public string Document { get; set; } = string.Empty;

}
