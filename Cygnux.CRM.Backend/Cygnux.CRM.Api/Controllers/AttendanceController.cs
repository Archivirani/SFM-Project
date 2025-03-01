namespace Cygnux.CRM.Api.Controllers;

using Application.Contracts;
using Application.Models.Request;
using Cygnux.CRM.Api.Helper;
using Microsoft.AspNetCore.Mvc;

[Route("api/v{version:apiVersion}/[controller]")]
[ApiController]
public class AttendanceController : ControllerBase
{
    private readonly IAttendanceRepository _attendanceRepository;
    public AttendanceController(IAttendanceRepository attendanceRepository)
    {
        _attendanceRepository = attendanceRepository;
    }

    [HttpPost]
    public async Task<IActionResult> AddAttendance(CreateAttendanceRequest createAttendance)
    {
        return Ok(await _attendanceRepository.AddAttendance(createAttendance));
    }

    [HttpGet]
    [Route("punchinout/{userId}")]
    public async Task<IActionResult> GetPunchInOut(string userId)
    {
        return Ok(await _attendanceRepository.GetAttendancePunchInOut(userId));
    }

}

