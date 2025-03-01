namespace Cygnux.CRM.Application.Contracts;

using Cygnux.CRM.Infrastructure.Models.Response.Customer;
using Infrastructure.Models.Response;
public interface ICustomerRepository
{
    Task<BaseResponse<IEnumerable<CustomerResponse>>> GetCustomerList(Dictionary<string, string> filters);
    Task<BaseResponse<IEnumerable<dynamic>>> ExportCustomer(Dictionary<string, string> filters);


    Task<BaseResponse<IEnumerable<LeadCustomerResponse>>> GetLeadCustomerList();


    Task<BaseResponse<CustomerResponse?>> GetCustomerDetails(string customerCode);
}