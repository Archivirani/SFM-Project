namespace Cygnux.CRM.Infrastructure.Models.Response;

public class CommonCreateResponse
{
    public string Message { get; set; } = string.Empty;

    public int Status { get; set; } = 0;

    public string? Id { get; set; }
}