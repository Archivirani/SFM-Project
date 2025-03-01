namespace Cygnux.CRM.External.Contracts;

using Microsoft.AspNetCore.Identity;

public interface IRoleService
{
    Task<IdentityResult> AddRole(string roleName);

    Task<IdentityResult> UpdateRole(string roleId, string newRoleName);
}