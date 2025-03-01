using Cygnux.CRM.Application.Helpers;
using Cygnux.CRM.Infrastructure.Implementations;

namespace Cygnux.CRM.Application.Models.Request;

public class CreateComplaintCloseRequest
{
    public Guid ComplaintID { get; set; } 
    public Guid CloseBy { get; set; } 
    public string CloseRemark { get; set; } = string.Empty;

    private string _closeDate = string.Empty;

    //public string CloseDate
    //{
    //    get => _closeDate;
    //    set => _closeDate = DateHelper.FormatDate(value);
    //}

    // Uncomment if SupportDocumentsId is required
    // public string SupportDocumentsId { get; set; } = string.Empty;
}
