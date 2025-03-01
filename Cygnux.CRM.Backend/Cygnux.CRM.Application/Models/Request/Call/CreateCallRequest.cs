using Cygnux.CRM.Application.Helpers;
using Cygnux.CRM.Infrastructure.Implementations;
using System.Globalization;

namespace Cygnux.CRM.Application.Models.Request;

public class CreateCallRequest : UserSettings
{
    public Guid LeadId { get; set; }
    public string CallPurpose { get; set; } = string.Empty;
    public string StartTime { get; set; } = string.Empty;
    public string EndTime { get; set; } = string.Empty;
    public int CallCategoryId { get; set; }
    public string AttendeeIDs { get; set; } = string.Empty;
    public string Remarks { get; set; } = string.Empty;
    public int? CallStatusId { get; set; }
    public string? CallMoM { get; set; }

    private string _callDate = string.Empty;

    public string CallDate
    {
        get => _callDate;
        set
        {
            _callDate = DateHelper.FormatDate(value);
        }
    }


}