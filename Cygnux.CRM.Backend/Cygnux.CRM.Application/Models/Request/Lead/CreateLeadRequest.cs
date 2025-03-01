using Cygnux.CRM.Application.Helpers;
using Cygnux.CRM.Infrastructure.Implementations;

namespace Cygnux.CRM.Application.Models.Request;

public class CreateLeadRequest : UserSettings
{
    public int LeadCategoryId { get; set; }
    public string CompanyName { get; set; } = string.Empty;
    public string ContactName { get; set; } = string.Empty;
    public string ContactNo { get; set; } = string.Empty;
    public string? Address { get; set; }
    public string? Email { get; set; }
    public int? CityId { get; set; }
    public string? BranchId { get; set; }
    public string? RegionId { get; set; }
    public string? DesignationId { get; set; }
    public string? LeadSourceId { get; set; }
    public string? AssignedToId { get; set; }
    public string? IndustryTypeId { get; set; }
    public string ServiceInterestedIDs { get; set; } = string.Empty;
    public bool IsActive { get; set; }


    private string _leadDate = string.Empty;

    public string LeadDate
    {
        get => _leadDate;
        set
        {
            _leadDate = DateHelper.FormatDate(value);
        }
    }
}