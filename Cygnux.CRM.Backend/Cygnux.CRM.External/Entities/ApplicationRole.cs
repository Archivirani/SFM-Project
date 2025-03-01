namespace Cygnux.CRM.External.Entities;

using Microsoft.AspNetCore.Identity;

public class ApplicationRole : IdentityRole
{
    public string EntryBy { get; set; } = string.Empty;
    public DateTime EntryDate { get; set; }
}