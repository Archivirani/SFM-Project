namespace Cygnux.CRM.Application.Implementations;

using Contracts;
using Cygnux.CRM.Application.Models.Request.Auth;
using Cygnux.CRM.External.Entities;
using External.Contracts;
using External.Models;
using Infrastructure.Models.Response;
using Models.Request;
using Newtonsoft.Json;

internal class AuthRepository : IAuthRepository
{
    private readonly IAuthService _authService;
    private readonly Infrastructure.Contracts.IUserService _userService;
    private readonly IJwtService _jwtService;

    public AuthRepository(IAuthService authService,
        Infrastructure.Contracts.IUserService userService,
        IJwtService jwtService)
    {
        _authService = authService;
        _userService = userService;
        _jwtService = jwtService;
    }

    public async Task<BaseResponse<RefreshTokenResponse>> GetRefreshTokenAsync(TokenRequest tokenRequest)
    {
        var refreshToken = await _userService.GetRefreshTokenAsync(tokenRequest.Token!);

        if (refreshToken == null || refreshToken.ExpiryDate < DateTime.UtcNow || refreshToken.IsRevoked)
        {
            return new BaseResponse<RefreshTokenResponse>(new ErrorResponse { Message = "Invalid or expired refresh token." });
        }

        var applicationUser = new ApplicationUser
        {
            Id = refreshToken.UserId
        };
        var newAccessToken = _jwtService.GenerateEncodedToken(applicationUser);
        var newRefreshToken = _jwtService.GenerateRefreshToken();

        // Update database with new refresh token
        refreshToken.IsRevoked = true; // Revoke old token

        await _userService.AddRefreshTroken(JsonConvert.SerializeObject(refreshToken));

        return new BaseResponse<RefreshTokenResponse>(new RefreshTokenResponse
        {
            AccessToken = newAccessToken,
            RefreshToken = newRefreshToken
        });
    }

    public async Task<BaseResponse<RefreshTokenResponse>> GenerateRefreshTokenAsync(string userId)
    {
        var newRefreshToken = _jwtService.GenerateRefreshToken();
        var refreshToken = new RefreshTokenResponse
        {
            UserId = userId,
            Token = newRefreshToken,
            ExpiryDate = DateTime.Now.AddDays(7)
        };
        var response = await _userService.AddRefreshTroken(JsonConvert.SerializeObject(refreshToken));
        return response.Status > 0 ? new BaseResponse<RefreshTokenResponse>(new RefreshTokenResponse
        {
            RefreshToken = newRefreshToken
        }) : new BaseResponse<RefreshTokenResponse>(new ErrorResponse { Message = response.Message });
    }

    public async Task<BaseResponse<LoginResponse>> LoginAsync(UserLoginRequest loginRequest)
    {
        return new BaseResponse<LoginResponse>(await _authService.LoginAsync(loginRequest.Email, loginRequest.Password));
    }
}