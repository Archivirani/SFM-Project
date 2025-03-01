namespace Cygnux.CRM.External.Contracts;

using Models;

public interface IAuthService
{
    Task<LoginResponse> LoginAsync(string email, string password);
}