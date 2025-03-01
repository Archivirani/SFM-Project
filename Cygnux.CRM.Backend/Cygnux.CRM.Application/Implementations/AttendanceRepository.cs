namespace Cygnux.CRM.Application.Implementations;

using Contracts;
using Cygnux.CRM.Application.Models.Request.Meeting;
using Cygnux.CRM.Infrastructure.Models.Response.Expense;
using Infrastructure.Contracts;
using Infrastructure.Models.Response;
using Models.Request;
using Newtonsoft.Json;
internal class AttendanceRepository : IAttendanceRepository
{
    private readonly IAttendanceService _attendanceService;

    public AttendanceRepository(IAttendanceService AttendanceService)
    {
        _attendanceService = AttendanceService;
    }

    public async Task<BaseResponse<CommonCreateResponse>> AddAttendance(CreateAttendanceRequest createAttendance)
    {
        var response = await _attendanceService.AddAttendance(JsonConvert.SerializeObject(createAttendance));

        return response.Status > 0 ? new BaseResponse<CommonCreateResponse>(response)
            : new BaseResponse<CommonCreateResponse>(new ErrorResponse { Message = response.Message });
    }

    public async Task<BaseResponse<AttendanceResponse>> GetAttendancePunchInOut(string userId)
    {
        var response = await _attendanceService.GetAttendancePunchInOut(userId);

        if (response == null || string.IsNullOrEmpty(response.UserID))
        {
            return new BaseResponse<AttendanceResponse>(new ErrorResponse { Message = "No attendance data found." });
        }

        return new BaseResponse<AttendanceResponse>(response);
    }



}
