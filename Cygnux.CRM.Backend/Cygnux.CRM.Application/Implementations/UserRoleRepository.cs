namespace Cygnux.CRM.Application.Implementations;

using Application.Contracts;
using External.Contracts;
using Infrastructure.Models.Response;
internal class UserRoleRepository : IUserRoleRepository
{
    private readonly IUserRoleService _userRoleService;

    public UserRoleRepository(IUserRoleService userRoleService)
    {
        _userRoleService = userRoleService;
    }

    public async Task<BaseResponse<CommonCreateResponse>> AddUserRole(string userId, string roleName)
    {
        var response = await _userRoleService.AddUserRole(userId, roleName);
        return new BaseResponse<CommonCreateResponse>(new CommonCreateResponse { Status = response.Succeeded ? 1 : 0, Message = "Done" });
    }

    public async Task<BaseResponse<CommonCreateResponse>> UpdateUserRoles(string userId, List<string> roles)
    {
        var response = await _userRoleService.UpdateUserRoles(userId, roles);
        return new BaseResponse<CommonCreateResponse>(new CommonCreateResponse { Status = response.Succeeded ? 1 : 0, Message = "Done" });
    }
}