namespace Cygnux.CRM.Api.Controllers;

using Application.Contracts;
using Microsoft.AspNetCore.Mvc;

[Route("api/v{version:apiVersion}/[controller]")]
[ApiController]
public class RoleController : ControllerBase
{
    private readonly IRoleRepository _roleRepository;

    public RoleController(IRoleRepository roleRepository)
    {
        _roleRepository = roleRepository;
    }

    [HttpPost]
    public async Task<IActionResult> AddUser(string name)
    {
        return Ok(await _roleRepository.AddRole(name));
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateUser(string id, string name)
    {
        return Ok(await _roleRepository.UpdateRole(id, name));
    }
}