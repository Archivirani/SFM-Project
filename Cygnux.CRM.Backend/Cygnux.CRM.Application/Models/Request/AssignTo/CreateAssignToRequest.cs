namespace Cygnux.CRM.Application.Models.Request;

public class CreateAssignToRequest
{
    public int LeadCategoryId { get; set; }
    public string LeadCategoryName { get; set; } = string.Empty;
    public int CustomerId { get; set; }
    public string CustomerName { get; set; } = string.Empty;
    public string UserName { get; set; } = string.Empty;
    public string AssignTo { get; set; } = string.Empty;
    public int RegionId { get; set; }
    public string Region { get; set; } = string.Empty;
    public int BranchId { get; set; }
    public string Branch { get; set; } = string.Empty;
}