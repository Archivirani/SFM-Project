namespace Cygnux.CRM.Application.Models.Request;

public class AssignToListRequest
{
    public int LeadCategoryId { get; set; }
    public string LeadCategoryName { get; set; } = string.Empty;
    public string CustomerName { get; set; } = string.Empty;
    public string UserName { get; set; } = string.Empty;
    public string AssignTo { get; set; } = string.Empty;
}