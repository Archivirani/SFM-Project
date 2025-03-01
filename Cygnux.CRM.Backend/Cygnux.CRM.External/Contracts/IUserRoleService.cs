namespace Cygnux.CRM.External.Contracts;

using Microsoft.AspNetCore.Identity;

public interface IUserRoleService
{
    Task<IdentityResult> AddUserRole(string userId, string roleName);

    Task<IdentityResult> UpdateUserRoles(string userId, List<string> roles);
}