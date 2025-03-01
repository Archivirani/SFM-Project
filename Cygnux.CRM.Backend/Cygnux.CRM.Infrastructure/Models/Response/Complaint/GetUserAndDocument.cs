
namespace Cygnux.CRM.Infrastructure.Models.Response;

public class GetUser
{
    public string UserId { get; set; } = string.Empty;
    public string UserName { get; set; } = string.Empty;
    public string ManagerId { get; set; } = string.Empty;
    public string ManagerName { get; set; } = string.Empty;
}

public class GetDocumentData
{
    public string DocumentNo { get; set; } = string.Empty;

    //public string DocumentName { get; set; } = string.Empty;
    public string CustomerID { get; set; } = string.Empty;
    public string CustomerName { get; set; } = string.Empty;
    public string CustomerEmail { get; set; } = string.Empty;
    public string EDD { get; set; } = string.Empty;
    public string DocumentDate { get; set; } = string.Empty;
    public string Origin { get; set; } = string.Empty;
    public string Destination { get; set; } = string.Empty;
}
