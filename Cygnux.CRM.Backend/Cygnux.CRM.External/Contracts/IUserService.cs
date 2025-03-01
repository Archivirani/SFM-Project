namespace Cygnux.CRM.External.Contracts;

using Entities;
using Microsoft.AspNetCore.Identity;

public interface IUserService
{
    Task<IdentityResult> AddUser(ApplicationUser applicationUser);

    Task<IdentityResult> UpdateUser(string id, ApplicationUser applicationUser);
}