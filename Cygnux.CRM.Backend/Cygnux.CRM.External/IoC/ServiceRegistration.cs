namespace Cygnux.CRM.External.IoC;

using Azure.Core;
using Contracts;
using Cygnux.CRM.External.Client;
using Cygnux.CRM.External.Options;
using Entities;
using Implementations;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;

public static class ServiceRegistration
{
    /// <summary>
    /// Register services to the dependency injection.
    /// </summary>
    /// <param name="services">The service collection.</param>
    /// <param name="connectionString"></param>
    /// <returns></returns>
    public static void ConfigureExternalServices(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddDbContext<AppDbContext>(options => options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")), contextLifetime: ServiceLifetime.Scoped);
        services.AddIdentityCore<ApplicationUser>(options =>
        {
            // Password settings
            options.Password.RequireDigit = true;
            options.Password.RequiredLength = 8;
            options.Password.RequireNonAlphanumeric = false;
            options.Password.RequireUppercase = true;
            options.Password.RequireLowercase = true;

            // Lockout settings
            options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(5);
            options.Lockout.MaxFailedAccessAttempts = 5;
        })
       .AddRoles<ApplicationRole>()
       .AddEntityFrameworkStores<AppDbContext>();
        services.AddTransient<ITmsApiClient, TmsApiClient>();
        services.Configure<TMSApiOptions>(configuration.GetSection(TMSApiOptions.TmsApis));

        services.AddHttpClient(TMSApiOptions.TmsApis, (provider, httpClient) =>
        {
            var config = provider.GetService<IOptions<TMSApiOptions>>()?.Value;
            if (config is not null)
            {
                httpClient.BaseAddress = new Uri(config.HostUrl);
                httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", config.Token);
            }
        });
        services.AddSingleton<IJwtService, JwtService>();
        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<IUserService, UserService>();
        services.AddScoped<IRoleService, RoleService>();
        services.AddScoped<IUserRoleService, UserRoleService>();
    }
}