namespace Cygnux.CRM.Application.Implementations;

using Contracts;
using Cygnux.CRM.Application.Models.Request.Meeting;
using Cygnux.CRM.Infrastructure.Models.Response.Expense;
using Infrastructure.Contracts;
using Infrastructure.Models.Response;
using Models.Request;
using Newtonsoft.Json;

internal class ExpenseRepository : IExpenseRepository
{
    private readonly IExpenseService _expenseService;

    public ExpenseRepository(IExpenseService ExpenseService)
    {
        _expenseService = ExpenseService;
    }

    public async Task<BaseResponse<IEnumerable<ExpenseResponse>>> GetExpenseList(Dictionary<string, string> filters)
    {
        var response = await _expenseService.GetExpenseList(JsonConvert.SerializeObject(filters));

        return new BaseResponse<IEnumerable<ExpenseResponse>>(response, response.Select(x => x.TotalCount).FirstOrDefault());
    }

    public async Task<BaseResponse<IEnumerable<dynamic>>> ExportExpense(Dictionary<string, string> filters)
    {
        var response = await _expenseService.ExportExpense(JsonConvert.SerializeObject(filters));

        return new BaseResponse<IEnumerable<dynamic>>(response, response.Select(x => x.TotalCount).FirstOrDefault());
    }

    public async Task<BaseResponse<ExpenseDetailResponse?>> GetExpenseDetails(Guid meetingId, string userId)
    {
        var response = await _expenseService.GetExpenseDetails(meetingId, userId);
        return new BaseResponse<ExpenseDetailResponse?>(response);
    }

    public async Task<BaseResponse<CommonCreateResponse>> AddExpense(CreateExpenseRequest createExpense)
    {
        var response = await _expenseService.AddExpense(JsonConvert.SerializeObject(createExpense));

        return response.Status > 0 ? new BaseResponse<CommonCreateResponse>(response)
            : new BaseResponse<CommonCreateResponse>(new ErrorResponse { Message = response.Message });
    }

    public async Task<BaseResponse<CommonCreateResponse>> AddExpenseApproval(ExpenseApprovalRequest expenseApprovalRequest)
    {
        var response = await _expenseService.AddExpenseApproval(JsonConvert.SerializeObject(expenseApprovalRequest));

        return response.Status > 0 ? new BaseResponse<CommonCreateResponse>(response)
            : new BaseResponse<CommonCreateResponse>(new ErrorResponse { Message = response.Message });
    }

    public async Task<BaseResponse<CommonCreateResponse>> UpdateExpense(Guid id, CreateExpenseRequest createExpense)
    {
        var response = await _expenseService.UpdateExpense(id, JsonConvert.SerializeObject(createExpense));

        return response.Status > 0 ? new BaseResponse<CommonCreateResponse>(response)
            : new BaseResponse<CommonCreateResponse>(new ErrorResponse { Message = response.Message });
    }

    public async Task<BaseResponse<CommonCreateResponse>> DeleteExpense(Guid id)
    {
        var response = await _expenseService.DeleteExpense(id);

        return response.Status > 0 ? new BaseResponse<CommonCreateResponse>(response)
            : new BaseResponse<CommonCreateResponse>(new ErrorResponse { Message = response.Message });
    }


    public async Task<BaseResponse<CommonCreateResponse>> AddExpenseGeneralMaster(CreateExpenseGeneralMasterRequest createReq)
    {
        var response = await _expenseService.AddExpenseGeneralMaster(JsonConvert.SerializeObject(createReq));

        return response.Status > 0 ? new BaseResponse<CommonCreateResponse>(response)
            : new BaseResponse<CommonCreateResponse>(new ErrorResponse { Message = response.Message });
    }

    public async Task<BaseResponse<CommonCreateResponse>> EditExpenseGeneralMaster(int id, CreateExpenseGeneralMasterRequest createReq)
    {
        var response = await _expenseService.EditExpenseGeneralMaster(id, JsonConvert.SerializeObject(createReq));

        return response.Status > 0 ? new BaseResponse<CommonCreateResponse>(response)
            : new BaseResponse<CommonCreateResponse>(new ErrorResponse { Message = response.Message });
    }

    public async Task<BaseResponse<IEnumerable<ExpenseGeneralMasterResponse>>> GetExpenseGeneralMasterList(int? id, Dictionary<string, string> filters, bool? export)
    {
        var response = await _expenseService.GetExpenseGeneralMasterList(id, JsonConvert.SerializeObject(filters), export);

        return new BaseResponse<IEnumerable<ExpenseGeneralMasterResponse>>(response, response.Select(x => x.TotalCount).FirstOrDefault());
    }


}