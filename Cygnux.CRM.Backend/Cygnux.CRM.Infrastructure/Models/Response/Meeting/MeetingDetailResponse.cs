namespace Cygnux.CRM.Infrastructure.Models.Response.Meeting;

public class MeetingDetailResponse : MeetingResponse
{
    public string ContactName { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string ContactNo { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;
    public int MeetingTypeId { get; set; }
    public string? MeetingType { get; set; }
    public string? LeadSource { get; set; }
    public string Attendees { get; set; } = string.Empty;
    public string? AttendeeNames { get; set; }
    public string? GeoLocation { get; set; }
    public decimal? Latitude { get; set; }
    public decimal? Longitude { get; set; }
    public string MeetingPurpose { get; set; } = string.Empty;
    public string MeetingLocationName { get; set; } = string.Empty;


    //public string CheckIn { get; set; } = string.Empty;
    //public string CheckOut { get; set; } = string.Empty;
    //public int MeetingTimeInMins { get; set; } = int.MinValue;
}
