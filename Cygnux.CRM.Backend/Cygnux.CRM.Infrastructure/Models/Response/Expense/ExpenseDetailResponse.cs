namespace Cygnux.CRM.Infrastructure.Models.Response.Expense;

public class ExpenseDetailResponse : ExpenseResponse
{
    public string PunchedInLocation { get; set; } = string.Empty;
    public string CheckedInLocation { get; set; } = string.Empty;
    public float DistanceInKm { get; set; }
    public string SupportingDocument { get; set; } = string.Empty;
    public string Remarks { get; set;} = string.Empty;
    public string? TransportMode { get; set; } = string.Empty;
    public string TransportModeId { get; set; } = string.Empty;
}
