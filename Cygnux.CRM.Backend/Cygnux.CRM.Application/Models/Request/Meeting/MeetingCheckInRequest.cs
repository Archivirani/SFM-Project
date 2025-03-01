using Cygnux.CRM.Infrastructure.Implementations;

namespace Cygnux.CRM.Application.Models.Request.Meeting
{
    public class MeetingCheckInRequest : UserSettings
    {
        public Guid MeetingId { get; set; }
        public bool? IsCheckedIn { get; set; }
    }
}
