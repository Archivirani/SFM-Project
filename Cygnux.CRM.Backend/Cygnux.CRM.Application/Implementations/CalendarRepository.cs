using Cygnux.CRM.Application.Contracts;
using Cygnux.CRM.Infrastructure.Contracts;
using Cygnux.CRM.Infrastructure.Models.Response;
using Newtonsoft.Json;

namespace Cygnux.CRM.Application.Implementations;

internal class CalendarRepository : ICalendarRepository
{
    private readonly ICalendarService _calendarService;

    public CalendarRepository(ICalendarService calendarService)
    {
        _calendarService = calendarService;
    }

    public async Task<BaseResponse<IEnumerable<CalendarResponse>>> GetCalendar(Dictionary<string, string> filters)
    {
        var response = await _calendarService.GetCalendar(JsonConvert.SerializeObject(filters));

        return new BaseResponse<IEnumerable<CalendarResponse>>(response);
    }
}
