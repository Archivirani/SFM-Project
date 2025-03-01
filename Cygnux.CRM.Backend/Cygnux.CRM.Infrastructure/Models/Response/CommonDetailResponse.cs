namespace Cygnux.CRM.Infrastructure.Models.Response;

public class CommonDetailResponse
{
    public string CreatedBy { get; set; } = string.Empty;

    public string? ModifiedBy { get; set; }

    public DateTime CreatedDate { get; set; }
    public DateTime? ModifiedDate { get; set; }
}
