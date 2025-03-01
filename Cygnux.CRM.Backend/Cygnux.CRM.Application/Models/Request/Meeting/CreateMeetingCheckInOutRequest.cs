using System;
using System.Globalization;

namespace Cygnux.CRM.Application.Models.Request
{
    public class CreateMeetingCheckInOutRequest
    {
        public Guid MeetingID { get; set; } = Guid.Empty; // Will be provided in JSON input

        public string UserID { get; set; } = string.Empty;

        public bool IsAttendee { get; set; }

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

        private string? _checkIn;
        public string? CheckIn
        {
            get => _checkIn;
            set
            {
                if (!string.IsNullOrWhiteSpace(value) && DateTime.TryParseExact(value, "dd/MM/yyyy HH:mm", CultureInfo.InvariantCulture, DateTimeStyles.None, out var parsedCheckIn))
                {
                    _checkIn = parsedCheckIn.ToString("yyyy-MM-dd HH:mm:ss");
                }
                else if (!string.IsNullOrWhiteSpace(value))
                {
                    throw new FormatException($"Invalid CheckIn format: {value}. Expected format: 'dd/MM/yyyy HH:mm'.");
                }
            }
        }

        private string? _checkOut;
        public string? CheckOut
        {
            get => _checkOut;
            set
            {
                if (!string.IsNullOrWhiteSpace(value) && DateTime.TryParseExact(value, "dd/MM/yyyy HH:mm", CultureInfo.InvariantCulture, DateTimeStyles.None, out var parsedCheckOut))
                {
                    _checkOut = parsedCheckOut.ToString("yyyy-MM-dd HH:mm:ss");
                }
                else if (!string.IsNullOrWhiteSpace(value))
                {
                    throw new FormatException($"Invalid CheckOut format: {value}. Expected format: 'dd/MM/yyyy HH:mm'.");
                }
            }
        }

        public decimal? Lat { get; set; }
        public decimal? Lng { get; set; }
    }
}
