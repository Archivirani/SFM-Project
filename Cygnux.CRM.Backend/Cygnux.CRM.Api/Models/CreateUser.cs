namespace CygnuxLSP.API.Models;

public class CreateUser
{
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string ContactNumber { get; set; } = string.Empty;
    public string EmailId { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string ConfirmPassword { get; set; } = string.Empty;
    public string EntryBy { get; set; } = string.Empty;
    public DateTime EntryDate { get; set; }
    public bool EditFlag { get; set; }
}