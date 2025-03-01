namespace Cygnux.CRM.Infrastructure.Implementations;

using Constants;
using Contracts;
using Cygnux.CRM.Infrastructure.Models.Response.Customer;
using Dapper;
using Models.Response;
using System.Data;

internal class CustomerService : ICustomerService
{
    private readonly IDbConnection _dbConnection;

    public CustomerService(IDbConnection dbConnection)
    {
        _dbConnection = dbConnection;
    }

    public async Task<IEnumerable<CustomerResponse>> GetCustomerList(string filters)
    {
        var parameters = new DynamicParameters();
        parameters.Add("@FiltersJson", filters, DbType.String);

        return await _dbConnection.QueryAsync<CustomerResponse>(
             StoredProcedureConstants.Usp_GetCustomer,
             parameters,
             commandType: CommandType.StoredProcedure
         );
    }
    public async Task<IEnumerable<dynamic>> ExportCustomer(string filters)
    {
        var parameters = new DynamicParameters();
        parameters.Add("@FiltersJson", filters, DbType.String);
        parameters.Add("@Export", true, DbType.Boolean);

        return await _dbConnection.QueryAsync<dynamic>(
             StoredProcedureConstants.Usp_GetCustomer,
             parameters,
             commandType: CommandType.StoredProcedure
         );
    }

    public async Task<IEnumerable<LeadCustomerResponse>> GetLeadCustomerList()
    {
        return await _dbConnection.QueryAsync<LeadCustomerResponse>("select LeadId, CompanyName as CustomerName from Leads");
    }

    public async Task<CustomerResponse> GetCustomerDetails(string customerCode)
    {
        var parameters = new DynamicParameters();
        parameters.Add("@CustomerCode", customerCode, DbType.String);

        return await _dbConnection.QueryFirstOrDefaultAsync<CustomerResponse>(
            StoredProcedureConstants.Usp_GetCustomer,
            param: parameters,
            commandType: CommandType.StoredProcedure
        ) ?? new CustomerResponse();
    }
}