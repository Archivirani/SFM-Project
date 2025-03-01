namespace Cygnux.CRM.External.Entities;

using Microsoft.AspNetCore.Identity;

public class ApplicationUser : IdentityUser
{
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string EntryBy { get; set; } = string.Empty;
    public DateTime EntryDate { get; set; }
}