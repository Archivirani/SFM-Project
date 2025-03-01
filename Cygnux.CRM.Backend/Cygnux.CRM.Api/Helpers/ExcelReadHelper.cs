namespace Cygnux.CRM.Api.Helper;
using ClosedXML.Excel;

public static class ExcelReadHelper
{
    /* changed because old method does not accespt .csv file but htis will do.(accept both files .csv and .xls/xlsx )*/
    public static List<Dictionary<string, string>> ExtractAllRows(IFormFile file)
    {
        var allRows = new List<Dictionary<string, string>>();

        if (file == null || file.Length == 0)
            return allRows;

        string fileExtension = Path.GetExtension(file.FileName).ToLower();

        if (fileExtension == ".csv")
        {
            // Process CSV file
            using (var reader = new StreamReader(file.OpenReadStream()))
            {
                var csvData = new List<string[]>();
                while (!reader.EndOfStream)
                {
                    string? line = reader.ReadLine(); // Read the line safely
                    if (!string.IsNullOrEmpty(line))  // Check for null or empty line
                    {
                        csvData.Add(line.Split(','));  // Now safe to split
                    }
                }

                if (csvData.Count > 1)
                {
                    var columnHeaders = csvData[0];  // First row is header

                    for (int i = 1; i < csvData.Count; i++) // Start from row 2
                    {
                        var rowData = new Dictionary<string, string>();
                        for (int col = 0; col < columnHeaders.Length; col++)
                        {
                            rowData[columnHeaders[col]] = col < csvData[i].Length ? csvData[i][col] : "";
                        }
                        allRows.Add(rowData);
                    }
                }
            }
        }
        else if (fileExtension == ".xls" || fileExtension == ".xlsx")
        {
            // Process Excel file
            using (var stream = new MemoryStream())
            {
                file.CopyTo(stream);
                stream.Position = 0;
                using (var workbook = new XLWorkbook(stream))
                {
                    var worksheet = workbook.Worksheet(1); // First sheet
                    var columnHeaders = worksheet.Row(1).Cells().Select(c => c.Value.ToString()).ToList();

                    foreach (var row in worksheet.RowsUsed().Skip(1)) // Skip header row
                    {
                        var rowData = new Dictionary<string, string>();
                        for (int col = 1; col <= columnHeaders.Count; col++)
                        {
                            rowData[columnHeaders[col - 1]] = row.Cell(col).Value.ToString();
                        }
                        allRows.Add(rowData);
                    }
                }
            }
        }

        return allRows;
    }

    /*below method is old one*/
    /*public static List<Dictionary<string, string>> ExtractAllRows(IFormFile file)
    {
        var allRows = new List<Dictionary<string, string>>();

        using (var stream = new MemoryStream())
        {
            file.CopyTo(stream);
            using (var workbook = new XLWorkbook(stream))
            {
                var worksheet = workbook.Worksheet(1); // First sheet
                var columnHeaders = worksheet.Row(1).Cells().Select(c => c.Value.ToString()).ToList();

                // Read each row and store data in a dictionary
                foreach (var row in worksheet.RowsUsed().Skip(1)) // Skip header row
                {
                    var rowData = new Dictionary<string, string>();
                    for (int col = 1; col <= columnHeaders.Count; col++)
                    {
                        rowData[columnHeaders[col - 1]] = row.Cell(col).Value.ToString();
                    }
                    allRows.Add(rowData);
                }
            }
        }

        return allRows;
    }*/

}