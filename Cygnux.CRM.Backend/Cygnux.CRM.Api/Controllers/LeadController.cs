namespace Cygnux.CRM.Api.Controllers;

using Application.Contracts;
using Application.Models.Request;
using Cygnux.CRM.Api.Helper;
using ExcelDataReader;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Data;
using System.Web.Helpers;

[Route("api/v{version:apiVersion}/[controller]")]
[ApiController]
public class LeadController : ControllerBase
{
    private readonly ILeadRepository _leadRepository;

    public LeadController(ILeadRepository LeadRepository)
    {
        _leadRepository = LeadRepository;
    }

    [HttpGet]
    public async Task<IActionResult> GetLeadList([FromQuery] Dictionary<string, string> filters)
    {
        return Ok(await _leadRepository.GetLeadList(filters));
    }

    [HttpGet("export")]
    public async Task<IActionResult> ExportLead([FromQuery] Dictionary<string, string> filters)
    {
        return Ok(await _leadRepository.ExportLead(filters));
    }

    [HttpGet]
    [Route("{id}")]
    public async Task<IActionResult> GetLeadDetails(Guid id)
    {
        return Ok(await _leadRepository.GetLeadDetails(id));
    }

    [HttpPost]
    public async Task<IActionResult> AddLead(CreateLeadRequest createLead)
    {
        return Ok(await _leadRepository.AddLead(createLead));
    }

    [HttpPost]
    [Route("import")]
    public async Task<IActionResult> ImportLead(IFormFile file)
    {
        var data = ExcelReadHelper.ExtractAllRows(file);
        if (data is not null)
        {
            string jsonData = JsonConvert.SerializeObject(data, Formatting.Indented);
            return Ok(await _leadRepository.ImportLead(jsonData));
        }
        return Ok();
    }

    [HttpPost("{id}")]
    public async Task<IActionResult> UpdatedLead(Guid id, CreateLeadRequest createLead)
    {
        return Ok(await _leadRepository.UpdateLead(id, createLead));
    }

    [HttpPatch("{id}")]
    public async Task<IActionResult> DeleteLead(Guid id)
    {
        return Ok(await _leadRepository.DeleteLead(id));
    }

    [HttpPost]
    [Route("ImportExcel")]
    public async Task<IActionResult> ImportExcel(IFormFile file)
    {
        if (file == null || file.Length == 0)
            return BadRequest("Please upload a valid Excel file.");

        try
        {
            using var stream = file.OpenReadStream();
            var result = await ReadExcelData(stream);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Error processing file: {ex.Message}");
        }
    }

    private async Task<List<Dictionary<string, object>>> ReadExcelData(Stream fileStream)
    {
        System.Text.Encoding.RegisterProvider(System.Text.CodePagesEncodingProvider.Instance);

        var dataList = new List<Dictionary<string, object>>();

        using var reader = ExcelReaderFactory.CreateReader(fileStream);
        var result = reader.AsDataSet(new ExcelDataSetConfiguration
        {
            ConfigureDataTable = (_) => new ExcelDataTableConfiguration
            {
                UseHeaderRow = true
            }
        });

        var dataTable = result.Tables[0];
        foreach (DataRow row in dataTable.Rows)
        {
            var rowData = new Dictionary<string, object>();
            foreach (DataColumn column in dataTable.Columns)
            {
                string columnName = column.ColumnName.Trim().Replace(" ", ""); // Remove spaces from headers
                rowData[columnName] = row[column] is DBNull ? null : row[column];
            }
            dataList.Add(rowData);
        }

        return await Task.FromResult(dataList);
    }

}