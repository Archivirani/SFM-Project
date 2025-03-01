namespace Cygnux.CRM.Infrastructure.Contracts;

using Cygnux.CRM.Infrastructure.Models.Response.Task;
using Models.Response;

public interface ITaskService
{
    Task<IEnumerable<TaskResponse>> GetTaskList(string filterJson);

    Task<TaskDetailReponse> GetTaskDetails(Guid id);
    Task<IEnumerable<dynamic>> ExportTask(string filterJson);

    Task<CommonCreateResponse> AddTask(string addTaskJson);

    Task<CommonCreateResponse> UpdateTask(Guid id, string updateTaskJson);

    Task<CommonCreateResponse> DeleteTask(Guid id);
}