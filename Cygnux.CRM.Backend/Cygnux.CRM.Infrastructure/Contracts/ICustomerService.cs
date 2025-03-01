namespace Cygnux.CRM.Infrastructure.Contracts;

using Cygnux.CRM.Infrastructure.Models.Response.Customer;
using Models.Response;

public interface ICustomerService
{
    Task<IEnumerable<CustomerResponse>> GetCustomerList(string filters);
    Task<IEnumerable<dynamic>> ExportCustomer(string filters);

    Task<IEnumerable<LeadCustomerResponse>> GetLeadCustomerList();

    Task<CustomerResponse> GetCustomerDetails(string customerCode);
}