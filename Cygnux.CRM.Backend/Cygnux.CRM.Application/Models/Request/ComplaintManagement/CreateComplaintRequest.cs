using Cygnux.CRM.Application.Helpers;
using Cygnux.CRM.Infrastructure.Implementations;

namespace Cygnux.CRM.Application.Models.Request;

public class CreateComplaintRequest : UserSettings
{
    //public string DocketNo { get; set; } = string.Empty;
    //public string BillingPartyName { get; set; } = string.Empty;
    //public string Origin { get; set; } = string.Empty;
    //public string Destination { get; set; } = string.Empty;
    //public string DocketStatus { get; set; } = string.Empty;
    //public string DefaulterBranch { get; set; } = string.Empty;

    //public int ComplaintType { get; set; }
    //public int ComplaintSubType { get; set; }
    //public int ComplaintPriorityId { get; set; }
    //public string ComplaintDescription { get; set; } = string.Empty;
    //public string SupportingDocument { get; set; } = string.Empty;
    //public string AssignTo { get; set; } = string.Empty;

    //private string _complaintDate = string.Empty;

    //public string ComplaintDate
    //{
    //    get => _complaintDate;
    //    set
    //    {
    //        _complaintDate = DateHelper.FormatDate(value);
    //    }
    //}

    //private string? _resolutionDate;

    //public string? ResolutionDate
    //{
    //    get => _resolutionDate;
    //    set
    //    {
    //        _resolutionDate = string.IsNullOrWhiteSpace(value) ? value : DateHelper.FormatDate(value!);
    //    }
    //}

    public int source { get; set; } 
    public int type { get; set; } 
    public int subType { get; set; } 
    public int priority { get; set; } 
    public string description { get; set; } = string.Empty;
    public string customerEmail { get; set; } = string.Empty;
    public string userID { get; set; } = string.Empty;
    public string document { get; set; } = string.Empty;
    public string documentNo { get; set; } = string.Empty;
    public Guid complaintId { get; set; }
    public string updateRemarks { get; set; } = string.Empty;
    public string assignedToId { get; set; } = string.Empty;
}