namespace Cygnux.CRM.External.Implementations;

using Contracts;
using Entities;
using Microsoft.AspNetCore.Identity;

internal class RoleService : IRoleService
{
    private readonly RoleManager<ApplicationRole> _roleManager;

    public RoleService(RoleManager<ApplicationRole> roleManager)
    {
        _roleManager = roleManager;
    }

    public async Task<IdentityResult> AddRole(string roleName)
    {
        if (string.IsNullOrWhiteSpace(roleName))
        {
            return IdentityResult.Failed(new IdentityError { Description = "Role name cannot be empty." });
        }

        var roleExists = await _roleManager.RoleExistsAsync(roleName);
        if (roleExists)
        {
            return IdentityResult.Failed(new IdentityError { Description = "Role already exists." });
        }

        return await _roleManager.CreateAsync(new ApplicationRole() { Name = roleName });
    }

    public async Task<IdentityResult> UpdateRole(string roleId, string newRoleName)
    {
        var role = await _roleManager.FindByIdAsync(roleId);
        if (role == null)
        {
            return IdentityResult.Failed(new IdentityError { Description = "Role not found." });
        }
        role.Name = newRoleName;
        return await _roleManager.UpdateAsync(role);
    }
}