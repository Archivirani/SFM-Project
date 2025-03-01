namespace Cygnux.CRM.Infrastructure.Models.Response.Lead;

public class LeadDetailResponse : LeadResponse
{

    public int CityId { get; set; }
    public string BranchId { get; set; } = string.Empty;
    public string RegionId { get; set; } = string.Empty;
    public string? DesignationId { get; set; }
    public string? LeadSourceId { get; set; }

    public string? LeadSource { get; set; }

    public string AssignedToId { get; set; } = string.Empty;
    public string? IndustryTypeId { get; set; }

    public string? Region { get; set; }
    public string? Branch { get; set; }
    public string? Designation { get; set; }
    public string? IndustryType { get; set; }
    public string? CreatedBy { get; set; }
    public string? ModifiedBy { get; set; }
    public string? City { get; set; }
    public string? ServiceInterestedNames { get; set; }

    public string ServiceInteresteds { get; set; } = string.Empty;
}
