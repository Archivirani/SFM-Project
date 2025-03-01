using Cygnux.CRM.Infrastructure.Models.Response;

namespace Cygnux.CRM.Application.Contracts;

public interface ICalendarRepository
{
    Task<BaseResponse<IEnumerable<CalendarResponse>>> GetCalendar(Dictionary<string, string> filters);
}
