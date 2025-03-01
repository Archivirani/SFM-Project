namespace Cygnux.CRM.Application.Contracts;

using Cygnux.CRM.Application.Models.Request.Auth;
using External.Models;
using Infrastructure.Models.Response;
using Models.Request;

public interface IAuthRepository
{
    public Task<BaseResponse<LoginResponse>> LoginAsync(UserLoginRequest loginRequest);

    public Task<BaseResponse<RefreshTokenResponse>> GetRefreshTokenAsync(TokenRequest tokenRequest);

    Task<BaseResponse<RefreshTokenResponse>> GenerateRefreshTokenAsync(string userId);
}