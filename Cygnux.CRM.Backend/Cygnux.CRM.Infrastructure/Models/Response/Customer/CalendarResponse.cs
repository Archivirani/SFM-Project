namespace Cygnux.CRM.Infrastructure.Models.Response;

public class CalendarResponse
{
    public string Title { get; set; } = string.Empty;

    public DateTime Start { get; set; }
    public DateTime End { get; set; }
    public string ClassName { get; set; }
    public Guid? MeetingId { get; set; }

    public Guid? CallId { get; set; }

    public bool? IsAllDayEvent { get; set; }

}