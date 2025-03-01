using Cygnux.CRM.Infrastructure.Models.Response;

namespace Cygnux.CRM.Infrastructure.Contracts;

public interface IUserService
{

    Task<RefreshTokenResponse> GetRefreshTokenAsync(string token);

    Task<CommonCreateResponse> AddRefreshTroken(string addTokenJson);
}
