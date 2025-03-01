using Cygnux.CRM.Application.Helpers;
using Cygnux.CRM.Infrastructure.Implementations;

namespace Cygnux.CRM.Application.Models.Request;

public class CreateExpenseRequest: UserSettings
{
    public Guid? MeetingId { get; set; } = null;
    public int TransportModeId { get; set; }
    public string PunchedInLocation { get; set; } = string.Empty;
    public string CheckedInLocation { get; set; } = string.Empty;
    public float DistanceInKm { get; set; }
    public decimal Amount { get; set; } = decimal.Zero;
    public string SupportingDocument { get; set; } = string.Empty;
    public string Remarks { get; set; } = string.Empty;
    public string CreatedBy { get; set; } = string.Empty;


    private string _expenseDate = string.Empty;

    public string ExpenseDate
    {
        get => _expenseDate;
        set
        {
            _expenseDate = DateHelper.FormatDate(value);
        }
    }
}