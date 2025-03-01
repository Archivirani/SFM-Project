namespace Cygnux.CRM.Api.IoC;

using Asp.Versioning;
using Microsoft.OpenApi.Models;
using Application.IoC;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;

public static class ServiceRegistration
{
    public static IServiceCollection ConfigureApiServices(this IServiceCollection services, IConfiguration configuration)
    {
        var signingKeys = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["Jwt:Key"]));

        services.AddAuthentication(x =>
        {
            x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        })
                         .AddJwtBearer(options =>
                         {
                             options.TokenValidationParameters =
                                   new TokenValidationParameters
                                   {
                                       RequireExpirationTime = true,
                                       RequireSignedTokens = false,
                                       ValidateIssuer = true,
                                       ValidIssuer = configuration["Jwt:Issuer"],
                                       ValidateAudience = true,
                                       ValidAudience = configuration["Jwt:Audience"],
                                       ValidateIssuerSigningKey = true,
                                       IssuerSigningKey = signingKeys,
                                       ValidateLifetime = true,
                                   };
                         });
        services.AddAuthorization();

        services.AddControllers().AddJsonOptions(options =>
        {
            options.JsonSerializerOptions.DefaultIgnoreCondition = System.Text.Json.Serialization.JsonIgnoreCondition.WhenWritingNull;
        });

        services.AddEndpointsApiExplorer();
        services.AddApiVersioning(options =>
        {
            options.AssumeDefaultVersionWhenUnspecified = true;
            options.DefaultApiVersion = new ApiVersion(1, 0);
            options.ReportApiVersions = true;
        });

        services.AddSwaggerGen(c =>
        {
            c.SwaggerDoc("v1", new OpenApiInfo { Title = "Cygnux.CRM.Api", Version = "v1" });
            c.AddSecurityDefinition("ApiKey", new OpenApiSecurityScheme
            {
                Description = "ApiKey must appear in header",
                Type = SecuritySchemeType.ApiKey,
                Name = "ApiKey",
                In = ParameterLocation.Header,
                Scheme = "ApiKeyScheme"
            });
            var key = new OpenApiSecurityScheme()
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "ApiKey"
                },
                In = ParameterLocation.Header
            };
            var requirement = new OpenApiSecurityRequirement
{
    { key, new List<string>() }
};
            c.AddSecurityRequirement(requirement);
        });

        services.AddCors(c =>
        {
            c.AddPolicy("AllowOrigin", options => options.WithOrigins("https://uat-smf-scorpion.cygnux.in", "http://localhost:4200")
             .AllowAnyHeader().AllowAnyMethod().WithMethods("OPTIONS", "GET", "POST", "PATCH", "PUT", "DELETE"));
        });

        services.ConfigureApplicationServices(configuration);
        return services;
    }
}