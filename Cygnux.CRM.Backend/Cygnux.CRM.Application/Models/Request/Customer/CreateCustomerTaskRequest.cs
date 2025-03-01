namespace Cygnux.CRM.Application.Models.Request;

public class CreateCustomerTaskRequest
{
    public int TaskId { get; set; }
    public string TaskName { get; set; } = string.Empty;
    public string TaskDate { get; set; } = string.Empty;
    public int LeadCategoryId { get; set; }
    public int CustomerId { get; set; }
    public string CustomerName { get; set; } = string.Empty;
    public int PriorityId { get; set; }
    public string Priority { get; set; } = string.Empty;
    public string AssignedToId { get; set; } = string.Empty;
    public string AssignedToName { get; set; } = string.Empty;
    public string TaskDescription { get; set; } = string.Empty;
    public int CreatedBy { get; set; }
    public string CreatedByDate { get; set; } = string.Empty;
}