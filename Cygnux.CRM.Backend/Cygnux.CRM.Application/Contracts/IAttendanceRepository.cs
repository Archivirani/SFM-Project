namespace Cygnux.CRM.Application.Contracts;

using Cygnux.CRM.Application.Models.Request.Meeting;
using Cygnux.CRM.Infrastructure.Models.Response.Expense;
using Infrastructure.Models.Response;
using Models.Request;
public interface IAttendanceRepository
{
    Task<BaseResponse<CommonCreateResponse>> AddAttendance(CreateAttendanceRequest createAttendance);
    Task<BaseResponse<AttendanceResponse>> GetAttendancePunchInOut(string userId);
}

