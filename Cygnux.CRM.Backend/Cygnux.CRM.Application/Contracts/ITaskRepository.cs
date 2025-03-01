namespace Cygnux.CRM.Application.Contracts;

using Cygnux.CRM.Infrastructure.Models.Response.Task;
using Infrastructure.Models.Response;
using Models.Request;

public interface ITaskRepository
{
    Task<BaseResponse<IEnumerable<TaskResponse>>> GetTaskList(Dictionary<string, string> filters);

    Task<BaseResponse<TaskDetailReponse?>> GetTaskDetails(Guid id);

    Task<BaseResponse<IEnumerable<dynamic>>> ExportTask(Dictionary<string, string> filters);


    Task<BaseResponse<CommonCreateResponse>> AddTask(CreateTaskRequest createTask);

    Task<BaseResponse<CommonCreateResponse>> UpdateTask(Guid id, CreateTaskRequest createTask);

    Task<BaseResponse<CommonCreateResponse>> DeleteTask(Guid id);
}