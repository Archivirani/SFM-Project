namespace Cygnux.CRM.Application.Contracts;

using Infrastructure.Models.Response;

public interface IUserRoleRepository
{
    Task<BaseResponse<CommonCreateResponse>> AddUserRole(string userId, string roleName);

    Task<BaseResponse<CommonCreateResponse>> UpdateUserRoles(string userId, List<string> roles);
}