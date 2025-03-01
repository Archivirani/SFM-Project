namespace Cygnux.CRM.Application.Implementations;

using Contracts;
using Cygnux.CRM.Infrastructure.Models.Response.Dashboard;
using Cygnux.CRM.Infrastructure.Models.Response.Lead;
using Infrastructure.Contracts;
using Infrastructure.Models.Response;
using Models.Request;
using Newtonsoft.Json;


internal class DashboardRepository : IDashboardRepository
{

    private readonly IDashboardService _dashboardService;

    public DashboardRepository(IDashboardService DashboardService)
    {
        _dashboardService = DashboardService;
    }
    public async Task<BaseResponse<DashboardResponse?>> GetDashboard(string userid, DateTime? startdate, DateTime? enddate)
    {
        var response = await _dashboardService.GetDashboard(userid, startdate, enddate);

        return new BaseResponse<DashboardResponse?>(response);
    }

    public async Task<BaseResponse<LeadByStatusResponse?>> GetLeadByStatus(string userid, DateTime? startdate, DateTime? enddate)
    {
        var response = await _dashboardService.GetLeadByStatus(userid, startdate, enddate);

        return new BaseResponse<LeadByStatusResponse?>(response);
    }

    public async Task<BaseResponse<List<LeadByCategoryResponse>?>> GetLeadByCategory(string userid, DateTime? startdate, DateTime? enddate)
    {
        var response = await _dashboardService.GetLeadByCategory(userid, startdate, enddate);

        return new BaseResponse<List<LeadByCategoryResponse>?>(response);
    }

    public async Task<BaseResponse<LeadBySourceResponse?>> GetLeadBySource(string userid, DateTime? startdate, DateTime? enddate)
    {
        var response = await _dashboardService.GetLeadBySource(userid, startdate, enddate);

        return new BaseResponse<LeadBySourceResponse?>(response);
    }



    public async Task<BaseResponse<MeetingByStatusResponse?>> GetMeetingByStatus(string userid, DateTime? startdate, DateTime? enddate)
    {
        var response = await _dashboardService.GetMeetingByStatus(userid, startdate, enddate);

        return new BaseResponse<MeetingByStatusResponse?>(response);
    }

    public async Task<BaseResponse<List<MeetingCountDayWiseResponse>?>> GetMeetingCountDayWise(string userid, DateTime? startdate, DateTime? enddate)
    {
        var response = await _dashboardService.GetMeetingCountDayWise(userid, startdate, enddate);

        return new BaseResponse<List<MeetingCountDayWiseResponse>?>(response);
    }
}
