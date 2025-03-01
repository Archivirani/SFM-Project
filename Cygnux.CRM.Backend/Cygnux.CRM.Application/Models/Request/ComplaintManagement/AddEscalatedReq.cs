
namespace Cygnux.CRM.Application.Models.Request;
public class AddEscalatedReq
{
    /*public string EscalatedId { get; set; } = string.Empty;*/
    public Guid ComplaintId { get; set; } 
    public string EscalatedTo { get; set; } = string.Empty;
    public string EscalatedEmail { get; set; } = string.Empty;
    public string EscalatedDate { get; set; } = string.Empty;
    public string EscalatedRemarks { get; set; } = string.Empty;
    public string Documents { get; set; } = string.Empty;
    /*public string SupportedDocId { get; set; } = string.Empty;*/
    public string userId { get; set; } = string.Empty;

}