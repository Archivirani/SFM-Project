namespace Cygnux.CRM.Application.Models.Request;

public class CreateCustomerCallRequest
{
    public string CallPurpose { get; set; } = string.Empty;
    public string CallDateTime { get; set; } = string.Empty;
    public int CallCategoryId { get; set; }
    public string CustomerName { get; set; } = string.Empty;
    public int CustomerId { get; set; }
    public string AttendeesId { get; set; } = string.Empty;
    public string Remarks { get; set; } = string.Empty;
    public int CreatedBy { get; set; }
    public string CreatedByDate { get; set; } = string.Empty;
}