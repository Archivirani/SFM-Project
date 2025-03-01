namespace Cygnux.CRM.Api.Controllers;

using Application.Contracts;
using Application.Models.Request;
using Cygnux.CRM.Application.Models.Request.Meeting;
using Microsoft.AspNetCore.Mvc;

[Route("api/v{version:apiVersion}/[controller]")]
[ApiController]
public class MeetingController : ControllerBase
{
    private readonly IMeetingRepository _meetingRepository;

    public MeetingController(IMeetingRepository MeetingRepository)
    {
        _meetingRepository = MeetingRepository;
    }

    [HttpGet]
    public async Task<IActionResult> GetMeetingList([FromQuery] Dictionary<string, string> filters)
    {
        return Ok(await _meetingRepository.GetMeetingList(filters));
    }
    [HttpGet("export")]
    public async Task<IActionResult> ExportMeeting([FromQuery] Dictionary<string, string> filters)
    {
        return Ok(await _meetingRepository.ExportMeeting(filters));
    }
    [HttpGet]
    [Route("{id}")]
    public async Task<IActionResult> GetMeetingDetails(Guid id)
    {
        return Ok(await _meetingRepository.GetMeetingDetails(id));
    }

    [HttpPost]
    public async Task<IActionResult> AddMeeting(CreateMeetingRequest createMeeting)
    {
        return Ok(await _meetingRepository.AddMeeting(createMeeting));
    }

    //[HttpPost("checkin")]
    //public async Task<IActionResult> AddCheckIn(MeetingCheckInRequest meetingCheckInRequest)
    //{
    //    return Ok(await _meetingRepository.AddCheckIn(meetingCheckInRequest));
    //}


    [HttpPost("checkinout")]
    public async Task<IActionResult> MeetingCheckInOut(CreateMeetingCheckInOutRequest jsonReq)
    {
        return Ok(await _meetingRepository.MeetingCheckInOut(jsonReq));
    }


    [HttpPost("{id}")]
    public async Task<IActionResult> UpdatedMeeting(Guid id, CreateMeetingRequest createMeeting)
    {
        return Ok(await _meetingRepository.UpdateMeeting(id, createMeeting));
    }

    [HttpPatch("{id}")]
    public async Task<IActionResult> DeleteMeeting(Guid id)
    {
        return Ok(await _meetingRepository.DeleteMeeting(id));
    }


    [HttpGet("momlist")]
    public async Task<IActionResult> GetMoMList()
    {
        return Ok(await _meetingRepository.GetMoMList());
    }
}