namespace Cygnux.CRM.Application.Models.Request;

public class BaseRequest
{
    public string EntryBy { get; set; } = string.Empty;
    public DateTime EntryDate { get; set; }
    public string? UpdateBy { get; set; }
    public DateTime? UpdateDate { get; set; }
}