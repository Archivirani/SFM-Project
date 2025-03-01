namespace Cygnux.CRM.Application.Models.Request;

public class CreateLspRequest
{
    public int LspId { get; set; }
    public string LspName { get; set; } = string.Empty;
    public string EmailId { get; set; } = string.Empty;
    public string MobileNo { get; set; } = string.Empty;
    public string Alias { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string ApiKey { get; set; } = string.Empty;
    public string ApiUrl { get; set; } = string.Empty;
    public string ApiUsername { get; set; } = string.Empty;
    public string ApiPassword { get; set; } = string.Empty;
    public string Logo { get; set; } = string.Empty;
    public bool IsActive { get; set; }
}