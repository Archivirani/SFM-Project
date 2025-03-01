using Cygnux.CRM.Application.Helpers;
using Cygnux.CRM.Infrastructure.Implementations;

namespace Cygnux.CRM.Application.Models.Request;

public class CreateMeetingRequest : UserSettings
{
    public Guid? LeadId { get; set; }
    public string? ContactName { get; set; }
    public string? Address { get; set; }
    public string ContactNo { get; set; } = string.Empty;
    public string MeetingPurpose { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public int MeetingTypeId { get; set; }
    public string MeetingLocation { get; set; } = string.Empty;
    public bool? IsAllDayEvent { get; set; } = false;
    public string AttendeeIDs { get; set; } = string.Empty;

    public string StartTime { get; set; } = string.Empty;

    public string EndTime { get; set; } = string.Empty;

    public string? MeetingMOM { get; set; }
    
    public decimal? Latitude { get; set; }

    public decimal? Longitude { get; set; }

    public string? GeoLocation { get; set; }


    private string _meetingDate = string.Empty;

    public string MeetingDate
    {
        get => _meetingDate;
        set
        {
            _meetingDate = DateHelper.FormatDate(value);
        }
    }
}