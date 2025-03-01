namespace Cygnux.CRM.Api.Filters;

using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

public class ApiKeyFilter : IAsyncActionFilter
{
    private const string ApiKeyName = "ApiKey";

    public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
    {
        if (!context.HttpContext.Request.Headers.TryGetValue
            (ApiKeyName, out var extractedApiKey) || string.IsNullOrWhiteSpace(extractedApiKey))
        {
            context.Result = new ContentResult()
            {
                StatusCode = 401,
                Content = "Api Key was not provided"
            };
            return;
        }

        var appSettings = context.HttpContext.RequestServices.GetRequiredService<IConfiguration>();

        var apiKey = appSettings.GetValue<string>(ApiKeyName) ?? string.Empty;

        if (!apiKey.Equals(extractedApiKey))
        {
            context.Result = new ContentResult()
            {
                StatusCode = 401,
                Content = "Api Key is not valid"
            };
            return;
        }

        await next();
    }
}