using Cygnux.CRM.Infrastructure.Constants;
using Cygnux.CRM.Infrastructure.Contracts;
using Cygnux.CRM.Infrastructure.Models.Response;
using Dapper;
using System.Data;

namespace Cygnux.CRM.Infrastructure.Implementations;

internal class CalendarService : ICalendarService
{
    private readonly IDbConnection _dbConnection;

    public CalendarService(IDbConnection dbConnection)
    {
        _dbConnection = dbConnection;
    }
    public async Task<IEnumerable<CalendarResponse>> GetCalendar(string filterJson)
    {
        var parameters = new DynamicParameters();
        parameters.Add("@FiltersJson", filterJson, DbType.String);

        return await _dbConnection.QueryAsync<CalendarResponse>(
             StoredProcedureConstants.Usp_GetCalendar,
             parameters,
             commandType: CommandType.StoredProcedure
         );
    }
}
