namespace Cygnux.CRM.Application.Implementations;

using Contracts;
using External.Contracts;
using Infrastructure.Models.Response;

internal class RoleRepository : IRoleRepository
{
    private readonly IRoleService _roleService;

    public RoleRepository(IRoleService roleService)
    {
        _roleService = roleService;
    }

    public async Task<BaseResponse<CommonCreateResponse>> AddRole(string name)
    {
        var response = await _roleService.AddRole(name);
        return new BaseResponse<CommonCreateResponse>(new CommonCreateResponse { Status = response.Succeeded ? 1 : 0 });
    }

    public async Task<BaseResponse<CommonCreateResponse>> UpdateRole(string id, string name)
    {
        var response = await _roleService.UpdateRole(id, name);
        return new BaseResponse<CommonCreateResponse>(new CommonCreateResponse { Status = response.Succeeded ? 1 : 0 });
    }
}