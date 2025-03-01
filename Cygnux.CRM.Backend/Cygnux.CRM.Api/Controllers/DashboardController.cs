namespace Cygnux.CRM.Api.Controllers;

using Application.Contracts;
using Application.Models.Request;
using Cygnux.CRM.Api.Helper;
using Microsoft.AspNetCore.Mvc;


[Route("api/v{version:apiVersion}/[controller]")]
[ApiController]
public class DashboardController : ControllerBase
{
    private readonly IDashboardRepository _dashboardRepsitory;

    public DashboardController(IDashboardRepository dashboardRepository)
    {
        _dashboardRepsitory = dashboardRepository;
    }

    [HttpGet]
    public async Task<IActionResult> GetDashboard(string userid, DateTime? startdate, DateTime? enddate)
    {
        var result = await _dashboardRepsitory.GetDashboard(userid, startdate, enddate);
        if (result == null)
            return NotFound(new { message = "Dashboard data not found." });

        return Ok(result);
    }

    [HttpGet("LeadByStatus")]
    public async Task<IActionResult> GetLeadByStatus(string userid, DateTime? startdate, DateTime? enddate)
    {
        return Ok(await _dashboardRepsitory.GetLeadByStatus(userid, startdate, enddate));
    }

    [HttpGet("LeadBySource")]
    public async Task<IActionResult> GetLeadBySource(string userid, DateTime? startdate, DateTime? enddate)
    {
        return Ok(await _dashboardRepsitory.GetLeadBySource(userid, startdate, enddate));
    }


    [HttpGet("LeadByCategory")]
    public async Task<IActionResult> GetLeadByCategory(string userid, DateTime? startdate, DateTime? enddate)
    {
        return Ok(await _dashboardRepsitory.GetLeadByCategory(userid, startdate, enddate));
    }


    [HttpGet("MeetingByStatus")]
    public async Task<IActionResult> GetMeetingByStatus(string userid, DateTime? startdate, DateTime? enddate)
    {
        return Ok(await _dashboardRepsitory.GetMeetingByStatus(userid, startdate, enddate));
    }

    [HttpGet("MeetingCountDayWise")]
    public async Task<IActionResult> GetMeetingCountDayWise(string userid, DateTime? startdate, DateTime? enddate)
    {
        return Ok(await _dashboardRepsitory.GetMeetingCountDayWise(userid, startdate, enddate));
    }

}

