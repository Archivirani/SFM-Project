namespace Cygnux.CRM.Infrastructure.Models.Response;

public class TaskResponse
{
    public Guid TaskId { get; set; }
    public string LeadCategoryName { get; set; } = string.Empty;
    public string TaskDate { get; set; }
    public string CustomerName { get; set; } = string.Empty;
    public string StartTime { get; set; } = string.Empty;
    public string EndTime { get; set; } = string.Empty;
    public string TaskStatus { get; set; } = string.Empty;
    public int? TotalCount { get; set; }
}