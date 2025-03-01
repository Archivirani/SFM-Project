namespace Cygnux.CRM.Application.Models.Request;

public class UpdateComplaintRequest
{
    public string DocketNo { get; set; } = string.Empty;
    public string BillingPartyName { get; set; } = string.Empty;
    public string Origin { get; set; } = string.Empty;
    public string Destination { get; set; } = string.Empty;
    public string ComplaintStatus { get; set; } = string.Empty;
    public string Remarks { get; set; } = string.Empty;
    public DateTime ResolutionDateAndTime { get; set; }
    public string DocketStatus { get; set; } = string.Empty;
    public string DefaulterBranch { get; set; } = string.Empty;
    public DateTime ComplaintDate { get; set; }
    public int ComplaintTypeId { get; set; }
    public int ComplaintSubTypeId { get; set; }
    public int ComplaintPriorityId { get; set; }
    public string ComplaintDescription { get; set; } = string.Empty;
    public string AssignTo { get; set; } = string.Empty;
    public string SupportingDoc { get; set; } = string.Empty;
    public string ComplaintUpdatedBy { get; set; } = string.Empty;
    public DateTime ComplaintUpdatedDateTime { get; set; }
}