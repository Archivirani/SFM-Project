namespace Cygnux.CRM.Infrastructure.Models.Response.Customer;

public class LeadCustomerResponse
{
    public Guid LeadId { get; set; }
    public string CustomerName { get; set; } = string.Empty;
}
