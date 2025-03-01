namespace Cygnux.CRM.Infrastructure.Models.Response;

public class AttendanceResponse
{
    public string UserID { get; set; } = string.Empty;
    public bool IsPunchIn { get; set; } = false;
    public string PunchIn { get; set; } = string.Empty;

    public bool IsPunchOut { get; set; } = false;
    public string PunchOut { get; set;} = string.Empty;

    public decimal? PunchInLat { get; set; }
    public decimal? PunchInLng { get; set; }

    public decimal? PunchOutLat { get; set; }
    public decimal? PunchOutLng { get; set; }
}

