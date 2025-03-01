namespace Cygnux.CRM.Infrastructure.Models.Response.Complaint;

public class ComplaintDetailResponse : ComplaintResponse
{
    public string BillingPartyName { get; set; } =string.Empty;
    public string Origin { get; set; } = string.Empty;
    public string Destination { get; set; } = string.Empty;
    public string DockerStatus { get; set; } = string.Empty;
    public string DefaulterBranch { get; set; } = string.Empty;
    public int ComplaintType { get; set; }
    public int ComplaintSubType { get; set; }
    public int ComplaintPriorityId { get; set; } 
    public string ComplaintDescription { get; set; } = string.Empty;
    public string AssignTo { get; set; } = string.Empty;
}
public class ComplaintDeatailResponseNew
{
    public Guid ComplaintID { get; set; }
    public string ComplaintCode { get; set; } = string.Empty;
    public string ComplaintDate { get; set; } = string.Empty;
    public string Source { get; set; } = string.Empty;
    public int Type { get; set; }
    public int SubType { get; set; }
    public int Priority { get; set; }
    public string Description { get; set; } = string.Empty;
    public string CustomerID { get; set; } = string.Empty ;
    public string CustomerEmail { get; set; } = string.Empty;
    public string UserID { get; set; } = string.Empty;
    public string Document { get; set; } = string.Empty;
    public string DocumentNo { get; set; } = string.Empty;
    public string AssignedTo { get; set; } = string.Empty;
    public string? CloseDate { get; set; }
    public Guid CloseBy { get; set; }
    public string CloseRemark { get; set; } = string.Empty;
    public Guid? SupportDocumentsId { get; set; }
    public int? TotalCount { get; set; }
    public string ComplaintStatus { get; set; } = string.Empty;
    public string? ResolutionDate { get; set; }
    public string SLAinHrs { get; set; } = string.Empty;
    public string RaisedBy { get; set; } = string.Empty;

}
