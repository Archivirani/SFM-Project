using Cygnux.CRM.Application.Helpers;
using Cygnux.CRM.Infrastructure.Implementations;

namespace Cygnux.CRM.Application.Models.Request;

public class CreateTaskRequest : UserSettings
{
    public string TaskName { get; set; } = string.Empty;
    public int LeadCategoryId { get; set; }
    public Guid LeadId { get; set; }
    public int PriorityId { get; set; }
    public string AssignedToIDs { get; set; } = string.Empty;
    public string TaskDescription { get; set; } = string.Empty;

    private string _taskDate = string.Empty;

    public string TaskDate
    {
        get => _taskDate;
        set
        {
            _taskDate = DateHelper.FormatDate(value);
        }
    }
}