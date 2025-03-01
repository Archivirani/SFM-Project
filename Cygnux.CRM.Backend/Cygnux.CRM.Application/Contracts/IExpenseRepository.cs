namespace Cygnux.CRM.Application.Contracts;

using Cygnux.CRM.Application.Models.Request.Meeting;
using Cygnux.CRM.Infrastructure.Models.Response.Expense;
using Infrastructure.Models.Response;
using Models.Request;

public interface IExpenseRepository
{
    Task<BaseResponse<IEnumerable<ExpenseResponse>>> GetExpenseList(Dictionary<string, string> filters);

    Task<BaseResponse<IEnumerable<dynamic>>> ExportExpense(Dictionary<string, string> filters);

    Task<BaseResponse<ExpenseDetailResponse?>> GetExpenseDetails(Guid meetingId, string userId);

    Task<BaseResponse<CommonCreateResponse>> AddExpense(CreateExpenseRequest createExpense);

    Task<BaseResponse<CommonCreateResponse>> AddExpenseApproval(ExpenseApprovalRequest expenseApprovalRequest);

    Task<BaseResponse<CommonCreateResponse>> UpdateExpense(Guid id, CreateExpenseRequest createExpense);

    Task<BaseResponse<CommonCreateResponse>> DeleteExpense(Guid id);

    Task<BaseResponse<CommonCreateResponse>> AddExpenseGeneralMaster(CreateExpenseGeneralMasterRequest createReq);
    Task<BaseResponse<CommonCreateResponse>> EditExpenseGeneralMaster(int id, CreateExpenseGeneralMasterRequest createReq);
    Task<BaseResponse<IEnumerable<ExpenseGeneralMasterResponse>>> GetExpenseGeneralMasterList(int? id, Dictionary<string, string> filters, bool? export);
}