namespace Cygnux.CRM.Application.Models.Request;

public class ProspectListRequest
{
    public int TotalProspect { get; set; }
    public int InProgress { get; set; }
    public int Converted { get; set; }
    public int ProspectGenerated { get; set; }
    public int KYCGenerated { get; set; }
    public int CustomerCreated { get; set; }
    public int PendingforApproval { get; set; }
    public int Rejected { get; set; }
    public int PendingForCustomerCodeCreation { get; set; }
}

public class ProspectDetailList
{
    public string ProspectName { get; set; } = string.Empty;
    public string ProspectStatus { get; set; } = string.Empty;
}