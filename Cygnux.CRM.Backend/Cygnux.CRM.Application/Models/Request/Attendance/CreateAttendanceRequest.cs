using System;
using System.Globalization;

namespace Cygnux.CRM.Application.Models.Request;

public class CreateAttendanceRequest
{
    public string UserID { get; set; } = string.Empty;

    private string _date = string.Empty;
    public string Date
    {
        get => _date;
        set
        {
            if (DateTime.TryParseExact(value, "dd/MM/yyyy", CultureInfo.InvariantCulture, DateTimeStyles.None, out var parsedDate))
            {
                _date = parsedDate.ToString("yyyy-MM-dd");
            }
            else
            {
                throw new FormatException($"Invalid date format: {value}. Expected format: 'dd/MM/yyyy'.");
            }
        }
    }

    private string? _punchIn;
    public string? PunchIn
    {
        get => _punchIn;
        set
        {
            if (!string.IsNullOrWhiteSpace(value) && DateTime.TryParseExact(value, "dd/MM/yyyy HH:mm", CultureInfo.InvariantCulture, DateTimeStyles.None, out var parsedPunchIn))
            {
                _punchIn = parsedPunchIn.ToString("yyyy-MM-dd HH:mm:ss");
            }
            else if (!string.IsNullOrWhiteSpace(value))
            {
                throw new FormatException($"Invalid PunchIn format: {value}. Expected format: 'dd/MM/yyyy HH:mm'.");
            }
        }
    }

    public decimal? PunchInLat { get; set; }
    public decimal? PunchInLng { get; set; }

    private string? _punchOut;
    public string? PunchOut
    {
        get => _punchOut;
        set
        {
            if (!string.IsNullOrWhiteSpace(value) && DateTime.TryParseExact(value, "dd/MM/yyyy HH:mm", CultureInfo.InvariantCulture, DateTimeStyles.None, out var parsedPunchOut))
            {
                _punchOut = parsedPunchOut.ToString("yyyy-MM-dd HH:mm:ss");
            }
            else if (!string.IsNullOrWhiteSpace(value))
            {
                throw new FormatException($"Invalid PunchOut format: {value}. Expected format: 'dd/MM/yyyy HH:mm'.");
            }
        }
    }

    public decimal? PunchOutLat { get; set; }
    public decimal? PunchOutLng { get; set; }
}
