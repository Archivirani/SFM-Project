namespace Cygnux.CRM.Application.Models.Request;

public class UserRequest
{
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string ContactNumber { get; set; } = string.Empty;
    public string EmailId { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}