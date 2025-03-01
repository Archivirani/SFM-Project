namespace Cygnux.CRM.Infrastructure.Models.Response;

public class CallResponse : CommonDetailResponse
{
    public Guid CallId { get; set; }
    public int CallCategoryId { get; set; }
    public string CallCategoryName { get; set; } = string.Empty;
    public string CallDate { get; set; } = string.Empty;
    public string CustomerName { get; set; } = string.Empty;
    public string StartTime { get; set; } = string.Empty;
    public string EndTime { get; set; } = string.Empty;
    public string CallStatus { get; set; } = string.Empty;
    public int? TotalCount { get; set; }
}