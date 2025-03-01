namespace Cygnux.CRM.Application.IoC;

using Contracts;
using Cygnux.CRM.Infrastructure.Contracts;
using External.IoC;
using Implementations;
using Infrastructure.IoC;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

public static class ServiceRegistration
{
    public static void ConfigureApplicationServices(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddScoped<ICustomerRepository, CustomerRepository>();
        services.AddScoped<ICallRepository, CallRepository>();
        services.AddScoped<IComplaintRepository, ComplaintRepository>();
        services.AddScoped<ILeadRepository, LeadRepository>();
        services.AddScoped<IMeetingRepository, MeetingRepository>();
        services.AddScoped<IExpenseRepository, ExpenseRepository>();
        services.AddScoped<ITaskRepository, TaskRepository>();
        services.AddScoped<IAuthRepository, AuthRepository>();
        services.AddScoped<IUserRepository, UserRepository>();
        services.AddScoped<IRoleRepository, RoleRepository>();
        services.AddScoped<IUserRoleRepository, UserRoleRepository>();
        services.AddScoped<IGeneralMasterRepository, GeneralMasterRepository>();
        services.AddScoped<ICalendarRepository, CalendarRepository>();
        services.AddScoped<IAttendanceRepository, AttendanceRepository>();

        // Register your repository and service
        services.AddScoped<IDashboardRepository, DashboardRepository>();



        services.ConfigureExternalServices(configuration);
        services.ConfigureInfrastructureServices(configuration);
    }
}