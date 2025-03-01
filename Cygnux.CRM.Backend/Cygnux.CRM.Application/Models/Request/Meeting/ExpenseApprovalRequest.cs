using Cygnux.CRM.Infrastructure.Implementations;

namespace Cygnux.CRM.Application.Models.Request.Meeting;

public class ExpenseApprovalRequest : UserSettings
{
    public Guid ExpenseId { get; set; }

    public int ApprovalStatus { get; set; }

    public string Status { get; set; } = string.Empty;
}
