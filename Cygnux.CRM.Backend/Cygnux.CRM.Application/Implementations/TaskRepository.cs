namespace Cygnux.CRM.Application.Implementations;

using Contracts;
using Cygnux.CRM.Infrastructure.Models.Response.Task;
using Infrastructure.Contracts;
using Infrastructure.Models.Response;
using Models.Request;
using Newtonsoft.Json;
internal class TaskRepository : ITaskRepository
{
    private readonly ITaskService _taskService;

    public TaskRepository(ITaskService TaskService)
    {
        _taskService = TaskService;
    }

    public async Task<BaseResponse<IEnumerable<TaskResponse>>> GetTaskList(Dictionary<string, string> filters)
    {
        var response = await _taskService.GetTaskList(JsonConvert.SerializeObject(filters));

        return new BaseResponse<IEnumerable<TaskResponse>>(response, response.Select(x => x.TotalCount).FirstOrDefault());
    }

    public async Task<BaseResponse<TaskDetailReponse?>> GetTaskDetails(Guid id)
    {
        var response = await _taskService.GetTaskDetails(id);
        return new BaseResponse<TaskDetailReponse?>(response);
    }

    public async Task<BaseResponse<IEnumerable<dynamic>>> ExportTask(Dictionary<string, string> filters)
    {
        var response = await _taskService.ExportTask(JsonConvert.SerializeObject(filters));

        return new BaseResponse<IEnumerable<dynamic>>(response, 1);
    }
    public async Task<BaseResponse<CommonCreateResponse>> AddTask(CreateTaskRequest createTask)
    {
        var response = await _taskService.AddTask(JsonConvert.SerializeObject(createTask));

        return response.Status > 0 ? new BaseResponse<CommonCreateResponse>(response)
            : new BaseResponse<CommonCreateResponse>(new ErrorResponse { Message = response.Message });
    }

    public async Task<BaseResponse<CommonCreateResponse>> UpdateTask(Guid id, CreateTaskRequest createTask)
    {
        var response = await _taskService.UpdateTask(id, JsonConvert.SerializeObject(createTask));

        return response.Status > 0 ? new BaseResponse<CommonCreateResponse>(response)
            : new BaseResponse<CommonCreateResponse>(new ErrorResponse { Message = response.Message });
    }

    public async Task<BaseResponse<CommonCreateResponse>> DeleteTask(Guid id)
    {
        var response = await _taskService.DeleteTask(id);

        return response.Status > 0 ? new BaseResponse<CommonCreateResponse>(response)
            : new BaseResponse<CommonCreateResponse>(new ErrorResponse { Message = response.Message });
    }
}