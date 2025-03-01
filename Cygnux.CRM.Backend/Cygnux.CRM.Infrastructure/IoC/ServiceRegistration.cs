namespace Cygnux.CRM.Infrastructure.IoC;

using Contracts;
using Implementations;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System.Data;

public static class ServiceRegistration
{
    public static void ConfigureInfrastructureServices(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddScoped<IUserSettings, UserSettings>();
        // Add Dapper or other DB connection service
        services.AddScoped<IDbConnection>(sp => new SqlConnection(configuration.GetConnectionString("DefaultConnection")));

        services.AddScoped<ICustomerService, CustomerService>();
        services.AddScoped<ILeadService, LeadService>();
        services.AddScoped<ICallService, CallService>();
        services.AddScoped<ITaskService, TaskService>();
        services.AddScoped<IMeetingService, MeetingService>();
        services.AddScoped<IExpenseService, ExpenseService>();
        services.AddScoped<IComplaintService, ComplaintService>();
        services.AddScoped<IUserService, UserService>();
        services.AddScoped<IGeneralMasterService, GeneralMasterService>();
        services.AddScoped<ICalendarService, CalendarService>();
        services.AddScoped<IDashboardService, DashboardService>();
        services.AddScoped<IAttendanceService, AttendanceService>();
    }
}