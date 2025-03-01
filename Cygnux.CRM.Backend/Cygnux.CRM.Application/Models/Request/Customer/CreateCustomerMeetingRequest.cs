namespace Cygnux.CRM.Application.Models.Request;

public class CreateCustomerMeetingRequest
{
    public int CustomerId { get; set; }
    public string CustomerName { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string ContactPerson { get; set; } = string.Empty;
    public string ContactNo { get; set; } = string.Empty;
    public string MeetingPurpose { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string MeetingDateTime { get; set; } = string.Empty;
    public int MeetingTypeId { get; set; }
    public string MeetingLocation { get; set; } = string.Empty;
    public bool IsAllDayEvent { get; set; }
    public string AttendeesId { get; set; } = string.Empty;
    public int CreatedBy { get; set; }
    public string CreatedByDate { get; set; } = string.Empty;
    public string MeetingMOM { get; set; } = string.Empty;
}