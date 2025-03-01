namespace Cygnux.CRM.External.Models;

public class DocketDetailResponse
{
    public string BookingBranch { get; set; } = string.Empty;// Origin
    public string ReassigN_DESTCD { get; set; } = string.Empty; // Destination
    public string DktStatus { get; set; } = string.Empty;
    public string PartyName { get; set; } = string.Empty;
}
