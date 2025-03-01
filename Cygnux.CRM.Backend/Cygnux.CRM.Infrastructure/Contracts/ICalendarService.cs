using Cygnux.CRM.Infrastructure.Models.Response;

namespace Cygnux.CRM.Infrastructure.Contracts;

public interface ICalendarService
{
    Task<IEnumerable<CalendarResponse>> GetCalendar(string filterJson);
}
