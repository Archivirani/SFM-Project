namespace Cygnux.CRM.External.Contracts;

using Entities;

public interface IJwtService
{
    public string GenerateEncodedToken(ApplicationUser userFromRepo);
    public string GenerateRefreshToken();
}