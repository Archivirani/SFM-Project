namespace Cygnux.CRM.Infrastructure.Contracts;

using Cygnux.CRM.Infrastructure.Models.Response.Expense;
using Models.Response;
public interface IAttendanceService
{
    Task<CommonCreateResponse> AddAttendance(string jsonRequest);
    Task<AttendanceResponse?> GetAttendancePunchInOut(string userId);
}
