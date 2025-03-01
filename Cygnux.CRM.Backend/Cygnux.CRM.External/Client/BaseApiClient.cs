namespace Cygnux.CRM.External.Client;

using Models;
using System.Net.Http.Json;

public class BaseApiClient
{
    protected readonly HttpClient _httpClient;
    protected BaseApiClient(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }
    protected async Task<ApiClientResponse<T>> SendRequestAsync<T>(
        string url,
        HttpMethod httpMethod,
        HttpContent httpContent = null!,
        CancellationToken cancellationToken = default)
    {
        using var request = new HttpRequestMessage(httpMethod, url) { Content = httpContent };
        try
        {
            var response = await _httpClient.SendAsync(request, cancellationToken);
            if (response.IsSuccessStatusCode)
            {
                var responseData = await response.Content.ReadFromJsonAsync<T>(cancellationToken);
                if (responseData is not null)
                {
                    return ApiClientResponse<T>.Success(responseData);
                }
            }
            return ApiClientResponse<T>.Failure(response.ReasonPhrase);
        }
        catch (Exception ex)
        {
            return ApiClientResponse<T>.Failure(ex.Message);
        }

    }
    protected string BuildApiUrl(string endPoint)
    {
        return $"{_httpClient.BaseAddress}/{endPoint}";
    }
}
