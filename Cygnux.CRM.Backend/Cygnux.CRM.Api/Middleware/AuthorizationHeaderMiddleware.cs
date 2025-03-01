using Cygnux.CRM.Infrastructure.Constants;
using Cygnux.CRM.Infrastructure.Contracts;

namespace Cygnux.CRM.Api.Middleware;

public class AuthorizationHeaderMiddleware
{
    private readonly RequestDelegate _next;

    public AuthorizationHeaderMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task Invoke(HttpContext context)
    {
        var user = context.User;
        if (user?.Identity?.IsAuthenticated == true)
        {
            var dataProvider = context.RequestServices.GetRequiredService<IUserSettings>();
            if (dataProvider != null)
            {
                dataProvider.UserId = user.Claims?.FirstOrDefault(x => x.Type == CommonConstants.UserId)?.Value ?? Guid.Empty.ToString();
            }
        }
        await _next.Invoke(context);


    }
}
