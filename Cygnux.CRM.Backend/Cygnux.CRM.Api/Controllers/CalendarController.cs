using Cygnux.CRM.Application.Contracts;
using Microsoft.AspNetCore.Mvc;

namespace Cygnux.CRM.Api.Controllers;

[Route("api/v{version:apiVersion}/[controller]")]
[ApiController]
public class CalendarController : ControllerBase
{
    private readonly ICalendarRepository _calendarRepository;

    public CalendarController(ICalendarRepository calendarRepository)
    {
        _calendarRepository = calendarRepository;
    }

    [HttpGet]
    public async Task<IActionResult> GetCalendar([FromQuery] Dictionary<string, string> filters)
    {
        return Ok(await _calendarRepository.GetCalendar(filters));
    }
}
