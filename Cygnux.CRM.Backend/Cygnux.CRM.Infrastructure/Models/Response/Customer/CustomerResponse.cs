namespace Cygnux.CRM.Infrastructure.Models.Response;

public class CustomerResponse
{
    public string TenantId { get; set; } = string.Empty;
    public string CustomerCode { get; set; } = string.Empty;
    public string CustomerName { get; set; } = string.Empty;
    public string ContractId { get; set; } = string.Empty;
    public string StartDate { get; set; } = string.Empty;
    public string EndDate { get; set; } = string.Empty;
    public decimal SalesMonth { get; set; }
    public decimal SalesYear { get; set; }
    public decimal OSonDate { get; set; }

    public int? TotalCount { get; set; }
}