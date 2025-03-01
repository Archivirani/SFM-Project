namespace Cygnux.CRM.Infrastructure.Models.Response.Call;

public class CallTotalResponse
{
    public string CallStatus { get; set; } = string.Empty;
    public string CallCategoryName { get; set; } = string.Empty;
    public int TotalCount { get; set; }
}
