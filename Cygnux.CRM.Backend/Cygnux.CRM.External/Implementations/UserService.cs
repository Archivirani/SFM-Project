namespace Cygnux.CRM.External.Implementations;

using Contracts;
using Entities;
using Microsoft.AspNetCore.Identity;

internal class UserService : IUserService
{
    private readonly UserManager<ApplicationUser> _userManager;

    public UserService(UserManager<ApplicationUser> userManager)
    {
        _userManager = userManager;
    }

    // Create a new user
    public async Task<IdentityResult> AddUser(ApplicationUser applicationUser)
    {
        return await _userManager.CreateAsync(applicationUser, applicationUser.PasswordHash!);
    }

    // Update an existing user
    public async Task<IdentityResult> UpdateUser(string id, ApplicationUser applicationUser)
    {
        var user = await _userManager.FindByIdAsync(id);
        if (user != null)
        {
            user.FirstName = applicationUser.FirstName;
            user.LastName = applicationUser.LastName;
            user.PhoneNumber = applicationUser.PhoneNumber;

            return await _userManager.UpdateAsync(applicationUser);
        }

        return IdentityResult.Failed(new IdentityError { Description = "User not found" });
    }
}