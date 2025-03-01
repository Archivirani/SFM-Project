namespace Cygnux.CRM.External.Models;

public class LoginResponse
{
    public string Token { get; set; } = string.Empty;
    public string RefreshToken { get; set; } = string.Empty;
    public string BranchCode { get; set; } = string.Empty;
    public List<LocationMasterResponse> MultiLocation { get; set; }

    public string? UserId { get; set; }
    public string? UserType { get; set; }
}

