namespace Cygnux.CRM.External.Implementations;

using Contracts;
using Entities;
using Microsoft.AspNetCore.Identity;
using Models;

internal class AuthService : IAuthService
{
    private readonly UserManager<ApplicationUser> _userManager;

    private readonly IJwtService _jwtService;

    public AuthService(UserManager<ApplicationUser> userManager, IJwtService jwtService)
    {
        _userManager = userManager;
        _jwtService = jwtService;
    }

    public async Task<LoginResponse> LoginAsync(string email, string password)
    {
        var user = await _userManager.FindByNameAsync(email);
        if (user is not null)
        {
            var isPassword = await _userManager.CheckPasswordAsync(user, password);
            if (isPassword)
            {
                var token = _jwtService.GenerateEncodedToken(user);
                return new LoginResponse { Token = token };
            }
        }
        return new LoginResponse();
    }
}