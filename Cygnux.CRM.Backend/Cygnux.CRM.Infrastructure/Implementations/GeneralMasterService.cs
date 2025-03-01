using Cygnux.CRM.Infrastructure.Constants;
using Cygnux.CRM.Infrastructure.Contracts;
using Cygnux.CRM.Infrastructure.Models.Response;
using Dapper;
using System.Data;

namespace Cygnux.CRM.Infrastructure.Implementations;

internal class GeneralMasterService : IGeneralMasterService
{
    private readonly IDbConnection _dbConnection;

    public GeneralMasterService(IDbConnection dbConnection)
    {
        _dbConnection = dbConnection;
    }
    public async Task<IEnumerable<GeneralMasterResponse>> GetGeneralMasterList(string codeType, string? searchText, CancellationToken cancellationToken)
    {
        var parameters = new DynamicParameters();
        parameters.Add("@CodeType", codeType, DbType.String);
        if (!string.IsNullOrWhiteSpace(searchText))
        {
            parameters.Add("@SearchText", searchText, DbType.String);
        }
        return await _dbConnection.QueryAsync<GeneralMasterResponse>(
             StoredProcedureConstants.Usp_GetGeneralMaster,
             parameters,
             commandType: CommandType.StoredProcedure
         );
    }
}
