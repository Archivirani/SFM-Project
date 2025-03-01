namespace Cygnux.CRM.Infrastructure.Models.Response.Call;

public class CallDetailResponse : CallResponse
{
    public Guid LeadId { get; set; }
    public string CallPurpose { get; set; } = string.Empty;
    public string Remarks { get; set; } = string.Empty;
    public string Attendees { get; set; } = string.Empty;
    public int? CallStatusId { get; set; }
    public string? Purpose { get; set; }
    public string? CallMOM { get; set; }
    public string? AttendeeNames { get; set; }
}
