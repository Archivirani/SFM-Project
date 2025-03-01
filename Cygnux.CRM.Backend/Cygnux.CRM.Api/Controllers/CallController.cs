namespace Cygnux.CRM.Api.Controllers;

using Application.Contracts;
using Application.Models.Request;
using Cygnux.CRM.Api.Helper;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Threading.Tasks;

[Route("api/v{version:apiVersion}/[controller]")]
[ApiController]
public class CallController : ControllerBase
{
    private readonly ICallRepository _callRepository;

    public CallController(ICallRepository callRepository)
    {
        _callRepository = callRepository;
    }

    [HttpGet]
    public async Task<IActionResult> GetCallList([FromQuery] Dictionary<string, string> filters)
    {
        return Ok(await _callRepository.GetCallList(filters));
    }

    [HttpGet("GetTotalCall")]
    public async Task<IActionResult> GetTotalCall()
    {
        return Ok(await _callRepository.GetTotalCall());
    }


    [HttpGet("export")]
    public async Task<IActionResult> ExportCall([FromQuery] Dictionary<string, string> filters)
    {
        return Ok(await _callRepository.ExportCall(filters));
    }

    [HttpGet]
    [Route("{id}")]
    public async Task<IActionResult> GetCallDetails(Guid id)
    {
        return Ok(await _callRepository.GetCallDetails(id));
    }

    [HttpPost]
    public async Task<IActionResult> AddCall(CreateCallRequest createCall)
    {
        return Ok(await _callRepository.AddCall(createCall));
    }

    [HttpPost("{id}")]
    public async Task<IActionResult> UpdatedCall(Guid id, CreateCallRequest createCall)
    {
        return Ok(await _callRepository.UpdateCall(id, createCall));
    }

    [HttpPost]
    [Route("import")]
    public async Task<IActionResult> ImportCall(IFormFile file)
    {
        var data = ExcelReadHelper.ExtractAllRows(file);
        if (data is not null)
        {
            string jsonData = JsonConvert.SerializeObject(data, Formatting.Indented);
            return Ok(await _callRepository.ImportCall(jsonData));
        }
        return Ok();
    }

    [HttpPatch("{id}")]
    public async Task<IActionResult> DeleteCall(Guid id)
    {
        return Ok(await _callRepository.DeleteCall(id));
    }
}