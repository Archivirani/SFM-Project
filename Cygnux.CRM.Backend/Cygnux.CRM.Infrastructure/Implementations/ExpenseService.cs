namespace Cygnux.CRM.Infrastructure.Implementations;

using Constants;
using Contracts;
using Cygnux.CRM.Infrastructure.Models.Response.Expense;
using Dapper;
using Models.Response;
using System.Data;

internal class ExpenseService : IExpenseService
{
    private readonly IDbConnection _dbConnection;

    public ExpenseService(IDbConnection dbConnection)
    {
        _dbConnection = dbConnection;
    }

    public async Task<IEnumerable<ExpenseResponse>> GetExpenseList(string filterJson)
    {
        var parameters = new DynamicParameters();
        parameters.Add("@FiltersJson", filterJson, DbType.String);

        return await _dbConnection.QueryAsync<ExpenseResponse>(
             StoredProcedureConstants.Usp_GetExpense,
             parameters,
             commandType: CommandType.StoredProcedure
         );
    }

    public async Task<IEnumerable<dynamic>> ExportExpense(string filterJson)
    {
        var parameters = new DynamicParameters();
        parameters.Add("@FiltersJson", filterJson, DbType.String);
        parameters.Add("@Export", true, DbType.Boolean);

        return await _dbConnection.QueryAsync<dynamic>(
             StoredProcedureConstants.Usp_GetExpense,
             parameters,
             commandType: CommandType.StoredProcedure
         );
    }

    public async Task<ExpenseDetailResponse> GetExpenseDetails(Guid meetingId, string userId)
    {
        var parameters = new DynamicParameters();
        parameters.Add("@MeetingID", meetingId, DbType.Guid);
        parameters.Add("@UserID", userId, DbType.String);

        return await _dbConnection.QueryFirstOrDefaultAsync<ExpenseDetailResponse>(
            StoredProcedureConstants.Usp_GetExpense,
            param: parameters,
            commandType: CommandType.StoredProcedure
        ) ?? new ExpenseDetailResponse();
    }

    public async Task<CommonCreateResponse> AddExpense(string addExpenseJson)
    {
        var parameters = new DynamicParameters();
        parameters.Add("@ExpenseJson", addExpenseJson, DbType.String);

        return await _dbConnection.QueryFirstOrDefaultAsync<CommonCreateResponse>(
            StoredProcedureConstants.Usp_Expense,
            param: parameters,
            commandType: CommandType.StoredProcedure
        ) ?? new CommonCreateResponse();
    }
    public async Task<CommonCreateResponse> AddExpenseApproval(string addExpenseApprovalJson)
    {
        var parameters = new DynamicParameters();
        parameters.Add("@ExpenseApprovalJson", addExpenseApprovalJson, DbType.String);

        return await _dbConnection.QueryFirstOrDefaultAsync<CommonCreateResponse>(
            StoredProcedureConstants.Usp_ExpenseApproval,
            param: parameters,
            commandType: CommandType.StoredProcedure
        ) ?? new CommonCreateResponse();
    }

    public async Task<CommonCreateResponse> UpdateExpense(Guid id, string updateExpenseJson)
    {
        var parameters = new DynamicParameters();
        parameters.Add("@ExpenseJson", updateExpenseJson, DbType.String);
        parameters.Add("@Id", id, DbType.Guid);

        return await _dbConnection.QueryFirstOrDefaultAsync<CommonCreateResponse>(
            StoredProcedureConstants.Usp_Expense,
            param: parameters,
            commandType: CommandType.StoredProcedure
        ) ?? new CommonCreateResponse();
    }

    public async Task<CommonCreateResponse> DeleteExpense(Guid id)
    {
        var deleteQuery = "Update Expenses Where IsActive = 0 Where ExpenseId = @Id";
        var rowAffected = await _dbConnection.ExecuteAsync(deleteQuery, new { Id = id });
        if (rowAffected > 0)
        {
            return new CommonCreateResponse { Status = 1, Message = "Expense deleted successfully" };
        }
        return new CommonCreateResponse();
    }


    public async Task<CommonCreateResponse> AddExpenseGeneralMaster(string jsonData)
    {
        var parameters = new DynamicParameters();
        parameters.Add("@jsonData", jsonData, DbType.String);


        return await _dbConnection.QueryFirstOrDefaultAsync<CommonCreateResponse>(
            StoredProcedureConstants.Usp_Add_Expense_General_Master,
            param: parameters,
            commandType: CommandType.StoredProcedure
        ) ?? new CommonCreateResponse();
    }

    public async Task<CommonCreateResponse> EditExpenseGeneralMaster(int id, string jsonData)
    {
        var parameters = new DynamicParameters();
        parameters.Add("@Id", id, DbType.Int64);
        parameters.Add("@jsonData", jsonData, DbType.String);

        return await _dbConnection.QueryFirstOrDefaultAsync<CommonCreateResponse>(
            StoredProcedureConstants.Usp_Edit_Expense_General_Master,
            param: parameters,
            commandType: CommandType.StoredProcedure
        ) ?? new CommonCreateResponse();
    }

    public async Task<IEnumerable<ExpenseGeneralMasterResponse>> GetExpenseGeneralMasterList(int? id, string filterJson, bool? export )
    {
        var parameters = new DynamicParameters();
        parameters.Add("@Id", id, DbType.Int64);
        parameters.Add("@FiltersJson", filterJson, DbType.String);
        parameters.Add("@Export", export, DbType.Boolean);

        return await _dbConnection.QueryAsync<ExpenseGeneralMasterResponse>(
             StoredProcedureConstants.Usp_Get_Expense_General_Master,
             parameters,
             commandType: CommandType.StoredProcedure
         );
    }

}