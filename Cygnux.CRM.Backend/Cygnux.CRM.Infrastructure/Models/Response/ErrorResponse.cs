namespace Cygnux.CRM.Infrastructure.Models.Response;

public class ErrorResponse
{
    public int ErrorCode { get; set; }
    public string Message { get; set; } = string.Empty;
    public object? Details { get; set; }
}