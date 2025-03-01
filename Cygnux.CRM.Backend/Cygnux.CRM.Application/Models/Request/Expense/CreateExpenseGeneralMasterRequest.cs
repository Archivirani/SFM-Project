using Cygnux.CRM.Application.Helpers;
using Cygnux.CRM.Infrastructure.Implementations;

namespace Cygnux.CRM.Application.Models.Request;
public class CreateExpenseGeneralMasterRequest
{
    public int? Id { get; set; }
    public int? DesignationId { get; set; }
    public int? TransportModeId { get; set; }
    public double? RatePerKM { get; set; }
    public string? CreatedBy { get; set; }
    public string? ModifiedBy { get; set; }
    public bool? Active { get; set; }   
}
