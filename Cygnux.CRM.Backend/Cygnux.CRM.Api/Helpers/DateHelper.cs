using System.Globalization;

namespace Cygnux.CRM.Api.Helpers;

public static class DateHelper
{
    public static DateTime? ParseDate(string dateString, string format, string cultureName = "en-GB")
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

    public static string FormatDate(DateTime date, string format = "MM-dd-yyyy")
    {
        return date.ToString(format);
    }
}
