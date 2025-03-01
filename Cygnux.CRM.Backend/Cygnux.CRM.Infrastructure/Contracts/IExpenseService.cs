namespace Cygnux.CRM.Infrastructure.Contracts;

using Cygnux.CRM.Infrastructure.Models.Response.Expense;
using Models.Response;

public interface IExpenseService
{
    Task<IEnumerable<ExpenseResponse>> GetExpenseList(string filterJson);
    Task<IEnumerable<dynamic>> ExportExpense(string filterJson);

    Task<ExpenseDetailResponse> GetExpenseDetails(Guid meetingId, string userId);

    Task<CommonCreateResponse> AddExpense(string addExpenseJson);

    Task<CommonCreateResponse> AddExpenseApproval(string addExpenseApprovalJson);

    Task<CommonCreateResponse> UpdateExpense(Guid id, string updateExpenseJson);

    Task<CommonCreateResponse> DeleteExpense(Guid id);
    Task<CommonCreateResponse> AddExpenseGeneralMaster(string jsonData);
    Task<CommonCreateResponse> EditExpenseGeneralMaster(int id, string jsonData);
    Task<IEnumerable<ExpenseGeneralMasterResponse>> GetExpenseGeneralMasterList(int? id, string filterJson, bool? export);
}