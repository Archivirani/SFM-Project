namespace Cygnux.CRM.Api.Controllers;

using Application.Contracts;
using Application.Models.Request;
using Cygnux.CRM.Application.Models.Request.Meeting;
using Microsoft.AspNetCore.Mvc;

[Route("api/v{version:apiVersion}/[controller]")]
[ApiController]
public class ExpenseController : ControllerBase
{
    private readonly IExpenseRepository _expenseRepository;

    public ExpenseController(IExpenseRepository ExpenseRepository)
    {
        _expenseRepository = ExpenseRepository;
    }

    [HttpGet]
    public async Task<IActionResult> GetExpenseList([FromQuery] Dictionary<string, string> filters)
    {
        return Ok(await _expenseRepository.GetExpenseList(filters));
    }


    [HttpGet("export")]
    public async Task<IActionResult> ExportExpense([FromQuery] Dictionary<string, string> filters)
    {
        return Ok(await _expenseRepository.ExportExpense(filters));
    }

    [HttpGet]
    [Route("{id}")]
    public async Task<IActionResult> GetExpenseDetails(Guid meetingId, string userId)
    {
        return Ok(await _expenseRepository.GetExpenseDetails(meetingId, userId));
    }

    [HttpPost]
    public async Task<IActionResult> AddExpense([FromForm] CreateExpenseRequest createExpense, IFormFile? file)
    {
        if (file != null && file.Length > 0)
        {
            // Process file
            var filePath = Path.Combine("Uploads", file.FileName);
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }
            createExpense.SupportingDocument = filePath;
        }
        return Ok(await _expenseRepository.AddExpense(createExpense));
    }

    [HttpPost("approval")]
    public async Task<IActionResult> AddExpenseApproval([FromBody] ExpenseApprovalRequest expenseApprovalRequest)
    {
        return Ok(await _expenseRepository.AddExpenseApproval(expenseApprovalRequest));
    }

    [HttpPost("{id}")]
    public async Task<IActionResult> UpdatedExpense(Guid id, [FromForm] CreateExpenseRequest createExpense, IFormFile? file)
    {
        if (file != null && file.Length > 0)
        {
            // Process file
            var filePath = Path.Combine("Uploads", file.FileName);
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }
            createExpense.SupportingDocument = filePath;
        }
        return Ok(await _expenseRepository.UpdateExpense(id, createExpense));
    }

    [HttpPatch("{id}")]
    public async Task<IActionResult> DeleteExpense(Guid id)
    {
        return Ok(await _expenseRepository.DeleteExpense(id));
    }



    [HttpPost("generalmaster/add")]
    public async Task<IActionResult> AddExpenseGeneralMaster(CreateExpenseGeneralMasterRequest createReq)
    {
        return Ok(await _expenseRepository.AddExpenseGeneralMaster(createReq));
    }

    [HttpPost("generalmaster/edit")]
    public async Task<IActionResult> EditExpenseGeneralMaster(int id, CreateExpenseGeneralMasterRequest modifyReq)
    {
        return Ok(await _expenseRepository.EditExpenseGeneralMaster(id, modifyReq));
    }

    [HttpGet("generalmaster/list")]
    public async Task<IActionResult> GetExpenseGeneralMasterList(int? id, [FromQuery] Dictionary<string, string> filters, bool? export)
    {
        return Ok(await _expenseRepository.GetExpenseGeneralMasterList(id,filters, export));
    }
}