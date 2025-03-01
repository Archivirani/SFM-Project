namespace Cygnux.CRM.Application.Contracts;

using Cygnux.CRM.Infrastructure.Models.Response.Dashboard;
using Infrastructure.Models.Response;
using Models.Request;

public interface IDashboardRepository
{
    Task<BaseResponse<DashboardResponse?>> GetDashboard(string userid, DateTime? startdate, DateTime? enddate);
    Task<BaseResponse<LeadByStatusResponse?>> GetLeadByStatus(string userid, DateTime? startdate, DateTime? enddate);
    Task<BaseResponse<List<LeadByCategoryResponse>?>> GetLeadByCategory(string userid, DateTime? startdate, DateTime? enddate);
    Task<BaseResponse<LeadBySourceResponse?>> GetLeadBySource(string userid, DateTime? startdate, DateTime? enddate);

    Task<BaseResponse<MeetingByStatusResponse?>> GetMeetingByStatus(string userid, DateTime? startdate, DateTime? enddate);
    Task<BaseResponse<List<MeetingCountDayWiseResponse>?>> GetMeetingCountDayWise(string userid, DateTime? startdate, DateTime? enddate);
}

