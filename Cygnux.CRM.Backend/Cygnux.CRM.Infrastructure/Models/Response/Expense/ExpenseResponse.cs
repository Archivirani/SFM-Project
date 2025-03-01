namespace Cygnux.CRM.Infrastructure.Models.Response.Expense;

public class ExpenseResponse
{
    public Guid ExpenseId { get; set; }
    public string ExpenseCode { get; set; } = string.Empty;
    public string ExpenseDate { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public string Status { get; set; } = string.Empty;
    public int TotalCount { get; set; }
    public Guid MeetingId { get; set; }
    public string CreatedBy { get; set; } = string.Empty;

    public Guid LeadId { get; set; }
    public string CompanyName { get; set; } = string.Empty;

    public decimal MeetingLat { get; set; }
    public decimal MeetingLng { get; set; }

    public DateTime CheckIn { get; set; }
    public DateTime CheckOut { get; set; }

    public int DistanceTravelled { get; set; }
    public string RequestID { get; set; } = string.Empty;

    public DateTime RequestDate { get; set; }
}

public class ExpenseGeneralMasterResponse
{
    public int Id{ get; set; }
    public int DesignationId { get; set; }
    public string? Designation { get; set; }

    public int TransportModeId { get; set; }
    public string? TransportMode { get; set; }

    public double RatePerKM { get; set; }
    public string CreatedBy { get; set; } = string.Empty;
    public DateTime CreatedDate { get; set; }

    public string ModifiedBy { get; set; } = string.Empty;
    public DateTime ModifiedDate { get; set; }

    public bool IsActive { get; set; }
    public int TotalCount { get; set; }

}