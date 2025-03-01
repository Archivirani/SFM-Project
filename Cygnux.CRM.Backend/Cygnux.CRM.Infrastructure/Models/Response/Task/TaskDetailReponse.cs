namespace Cygnux.CRM.Infrastructure.Models.Response.Task;

public class TaskDetailReponse : TaskResponse
{
    public string TaskDescription { get; set; } = string.Empty;
    public string TaskName { get; set; } = string.Empty;
    public Guid LeadId { get; set; }
    public int PriorityId { get; set; }
    public string Priority { get; set; } = string.Empty;
    public int LeadCategoryId { get; set; }
    public string LeadCategory { get; set; } = string.Empty;
    public string AssignedTos { get; set; } = string.Empty;
    public string AssignedToNames { get; set; } = string.Empty;

}
