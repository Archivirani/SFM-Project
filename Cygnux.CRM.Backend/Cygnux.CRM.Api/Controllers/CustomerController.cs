namespace Cygnux.CRM.Api.Controllers;

using Application.Contracts;
using Microsoft.AspNetCore.Mvc;

[Route("api/v{version:apiVersion}/[controller]")]
[ApiController]
public class CustomerController : ControllerBase
{
    private readonly ICustomerRepository _customerRepository;

    public CustomerController(ICustomerRepository customerRepository)
    {
        _customerRepository = customerRepository;
    }

    [HttpGet]
    
    public async Task<IActionResult> GetCustomerList([FromQuery] Dictionary<string, string> filters)
    {
        return Ok(await _customerRepository.GetCustomerList(filters));
    }

    [HttpGet("export")]

    public async Task<IActionResult> ExportCustomer([FromQuery] Dictionary<string, string> filters)
    {
        return Ok(await _customerRepository.ExportCustomer(filters));
    }

    [HttpGet]
    [Route("lead")]
    public async Task<IActionResult> GetLeadCustomerList()
    {
        return Ok(await _customerRepository.GetLeadCustomerList());
    }

    [HttpGet]
    [Route("{id}")]
    public async Task<IActionResult> GetCustomerDetails(string id)
    {
        return Ok(await _customerRepository.GetCustomerDetails(id));
    }
}