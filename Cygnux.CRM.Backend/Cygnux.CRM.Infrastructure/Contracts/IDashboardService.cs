namespace Cygnux.CRM.Infrastructure.Contracts;

using Cygnux.CRM.Infrastructure.Models.Response.Dashboard;
using Models.Response;
public interface IDashboardService
{
    Task<DashboardResponse> GetDashboard(string userid, DateTime? startdate, DateTime? enddate);

    Task<LeadByStatusResponse> GetLeadByStatus(string userid, DateTime? startdate, DateTime? enddate);

    Task<List<LeadByCategoryResponse>> GetLeadByCategory(string userid, DateTime? startdate, DateTime? enddate);

    Task<LeadBySourceResponse> GetLeadBySource(string userid, DateTime? startdate, DateTime? enddate);

    Task<MeetingByStatusResponse> GetMeetingByStatus(string userid, DateTime? startdate, DateTime? enddate);
    Task<List<MeetingCountDayWiseResponse>> GetMeetingCountDayWise(string userid, DateTime? startdate, DateTime? enddate);
}

