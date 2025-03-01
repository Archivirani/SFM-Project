namespace Cygnux.CRM.External.Models;

public class ApiClientResponse<T>
{
    public bool IsSuccess { get; set; }

    public T? Data { get;}

    public string? ErrorMessage { get;}

    private ApiClientResponse(bool isSuccess, T? data, string? errorMessage) 
    {
        IsSuccess = isSuccess;
        Data = data;
        ErrorMessage = errorMessage;
    }
    public static ApiClientResponse<T> Success(T? data) => new(true, data, default);
    public static ApiClientResponse<T> Failure(string? errorMessage) => new(false, default, errorMessage);
}
