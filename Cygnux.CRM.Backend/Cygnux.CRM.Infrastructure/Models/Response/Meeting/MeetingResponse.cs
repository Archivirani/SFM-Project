namespace Cygnux.CRM.Infrastructure.Models.Response;

public class MeetingResponse : CommonDetailResponse
{
    public Guid LeadId { get; set; }
    public Guid MeetingId { get; set; }
    public string CustomerName { get; set; } = string.Empty;
    public string MeetingDate { get; set; } = string.Empty;
    public string StartTime { get; set; } = string.Empty;
    public string EndTime { get; set; } = string.Empty;
    public int TATinHrs { get; set; }
    public string MeetingStatus { get; set; } = string.Empty;
    public string MeetingMOM { get; set; } = string.Empty;
    public int? TotalCount { get; set; }
    public string MeetingLocation { get; set; } = string.Empty;


    public string CheckIn { get; set; } = string.Empty;
    public string CheckOut { get; set; } = string.Empty;
    public string Latitude { get; set; } = string.Empty;
    public string Longitude { get; set; } = string.Empty;
    public int MeetingTimeInMins { get; set; } = 0;
}

public class MoMListResponse
{
    public int Id { get; set; }
    public string? MoM { get; set; }
}