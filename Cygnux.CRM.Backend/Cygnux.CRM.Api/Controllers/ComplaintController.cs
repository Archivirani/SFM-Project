namespace Cygnux.CRM.Api.Controllers;

using Application.Contracts;
using Application.Models.Request;
using Cygnux.CRM.Infrastructure.Models.Response;
using Microsoft.AspNetCore.Mvc;


[Route("api/v{version:apiVersion}/[controller]")]
[ApiController]
public class ComplaintController : ControllerBase
{
    private readonly IComplaintRepository _complaintRepository;

    public ComplaintController(IComplaintRepository ComplaintRepository)
    {
        _complaintRepository = ComplaintRepository;
    }

    [HttpPost]
    [Route("Add")]
    public async Task<IActionResult> AddComplaint(CreateComplaintReq createComplaintadd)
    {
        return Ok(await _complaintRepository.AddComplaint(createComplaintadd));
    }

    [HttpGet]
    [Route("GetList")]
    public async Task<IActionResult> GetComplaintList([FromQuery] Dictionary<string, string> filters, bool? export)
    {
        return Ok(await _complaintRepository.GetComplaintList(filters, export));
    }

    //[HttpGet("export")]
    //public async Task<IActionResult> ExportComplaint([FromQuery] Dictionary<string, string> filters)
    //{
    //    return Ok(await _complaintRepository.ExportComplaint(filters));
    //}

    [HttpGet]
    [Route("GetDetail/{id}")]
    public async Task<IActionResult> GetComplaintDetails(Guid id)
    {
        return Ok(await _complaintRepository.GetComplaintDetails(id));
    }

    [HttpPost]
    [Route("Update/{id}")]
    public async Task<IActionResult> UpdatedComplaint(Guid id, CreateComplaintRequest createComplaint)
    {
        return Ok(await _complaintRepository.UpdateComplaint(id, createComplaint));
    }


    [HttpPost("close")]
    public async Task<IActionResult> CloseComplaint(CreateComplaintCloseRequest createReq)
    {
        return Ok(await _complaintRepository.CloseComplaint(createReq));
    }

    [HttpPatch]
    [Route("Delete/{id}")]
    public async Task<IActionResult> DeleteComplaint(Guid id)
    {
        return Ok(await _complaintRepository.DeleteComplaint(id));
    }

    [HttpPost]
    [Route("AddEscTkt")]
    public async Task<IActionResult> AddEscalationTicket(AddEscalatedReq addEscalateddata)
    {
        return Ok(await _complaintRepository.AddEscalated(addEscalateddata));
    }

    [HttpGet]
    [Route("GetUser")]
    public async Task<IActionResult> GetUser(string userid)
    {
        return Ok(await _complaintRepository.GetUser(userid));
    }

    [HttpGet]
    [Route("GetDocData")]
    public async Task<IActionResult> GetDocket(string docNo)
    {
        return Ok(await _complaintRepository.GetDocument(docNo));
    }

  

    [HttpGet]
    [Route("GetCount")]
    public async Task<IActionResult> GetComCount(string? StartDate, string? EndDate, string UserID)
    {
        return Ok(await _complaintRepository.GetComCount(StartDate, EndDate, UserID));
    }

}
