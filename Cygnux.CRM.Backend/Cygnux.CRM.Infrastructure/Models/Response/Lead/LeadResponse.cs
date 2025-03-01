namespace Cygnux.CRM.Infrastructure.Models.Response;

public class LeadResponse
{
    public Guid LeadId { get; set; }
    public string LeadCategory { get; set; } = string.Empty;
    public int LeadCategoryId { get; set; }
    public string CompanyName { get; set; } = string.Empty;
    public string LeadDate { get; set; } = string.Empty;
    public string AssignedTo { get; set; } = string.Empty;
    public string ContactName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string ContactNo { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public bool IsActive { get; set; }
    public int? TotalCount { get; set; }
}