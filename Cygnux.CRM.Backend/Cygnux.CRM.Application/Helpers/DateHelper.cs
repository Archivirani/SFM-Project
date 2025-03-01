using System.Globalization;

namespace Cygnux.CRM.Application.Helpers;

public static class DateHelper
{
    private static DateTime? ParseDate(string dateString, string format, string cultureName = "en-GB")
    {
        if (DateTime.TryParseExact(
            dateString,
            format,
            new CultureInfo(cultureName),
            DateTimeStyles.None,
            out DateTime parsedDate))
        {
            return parsedDate;
        }
        else
        {
            throw new FormatException("Invalid date format.");
        }
    }

    public static string FormatDate(string value)
    {
        var parsedDate = ParseDate(value, "dd/MM/yyyy") ?? throw new FormatException("Invalid date format.");
        return parsedDate.ToString("MM-dd-yyyy");
    }
}
