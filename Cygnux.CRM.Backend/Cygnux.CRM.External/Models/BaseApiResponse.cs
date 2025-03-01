namespace Cygnux.CRM.External.Models;

public class BaseApiResponse<T>
{
    public int StatusCode { get; set; }

    public int Status { get; set; }

    public List<T?> Data { get; set; }

}

public class BaseApiSingularResponse<T>
{
    public int StatusCode { get; set; }

    public int Status { get; set; }

    public T? Data { get; set; }

}


