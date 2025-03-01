namespace Cygnux.CRM.Application.Implementations;

using Contracts;
using Cygnux.CRM.Infrastructure.Models.Response.Customer;
using Infrastructure.Contracts;
using Infrastructure.Models.Response;
using Newtonsoft.Json;

internal class CustomerRepository : ICustomerRepository
{
    private readonly ICustomerService _customerService;

    public CustomerRepository(ICustomerService customerService)
    {
        _customerService = customerService;
    }

    public async Task<BaseResponse<IEnumerable<CustomerResponse>>> GetCustomerList(Dictionary<string, string> filters)
    {
        var response = await _customerService.GetCustomerList(JsonConvert.SerializeObject(filters));
        return new BaseResponse<IEnumerable<CustomerResponse>>(response, response.Select(x => x.TotalCount).FirstOrDefault());
    }

    public async Task<BaseResponse<IEnumerable<dynamic>>> ExportCustomer(Dictionary<string, string> filters)
    {
        var response = await _customerService.ExportCustomer(JsonConvert.SerializeObject(filters));
        return new BaseResponse<IEnumerable<dynamic>>(response);
    }


    public async Task<BaseResponse<IEnumerable<LeadCustomerResponse>>> GetLeadCustomerList()
    {
        var response = await _customerService.GetLeadCustomerList();
        return new BaseResponse<IEnumerable<LeadCustomerResponse>>(response);
    }

    public async Task<BaseResponse<CustomerResponse?>> GetCustomerDetails(string customerCode)
    {
        var response = await _customerService.GetCustomerDetails(customerCode);

        return new BaseResponse<CustomerResponse?>(response);
    }
}