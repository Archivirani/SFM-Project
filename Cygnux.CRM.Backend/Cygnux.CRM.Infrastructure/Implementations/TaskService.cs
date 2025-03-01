namespace Cygnux.CRM.Infrastructure.Implementations;

using Constants;
using Contracts;
using Cygnux.CRM.Infrastructure.Models.Response.Task;
using Dapper;
using Models.Response;
using System.Data;

internal class TaskService : ITaskService
{
    private readonly IDbConnection _dbConnection;

    public TaskService(IDbConnection dbConnection)
    {
        _dbConnection = dbConnection;
    }

    public async Task<IEnumerable<TaskResponse>> GetTaskList(string filterJson)
    {
        var parameters = new DynamicParameters();
        parameters.Add("@FiltersJson", filterJson, DbType.String);

        return await _dbConnection.QueryAsync<TaskResponse>(
             StoredProcedureConstants.Usp_GetTask,
             parameters,
             commandType: CommandType.StoredProcedure
         );
    }

    public async Task<TaskDetailReponse> GetTaskDetails(Guid id)
    {
        var parameters = new DynamicParameters();
        parameters.Add("@Id", id, DbType.Guid);

        return await _dbConnection.QueryFirstOrDefaultAsync<TaskDetailReponse>(
            StoredProcedureConstants.Usp_GetTask,
            param: parameters,
            commandType: CommandType.StoredProcedure
        ) ?? new TaskDetailReponse();
    }
    public async Task<IEnumerable<dynamic>> ExportTask(string filterJson)
    {
        var parameters = new DynamicParameters();
        parameters.Add("@FiltersJson", filterJson, DbType.String);
        parameters.Add("@Export", true, DbType.Boolean);

        return await _dbConnection.QueryAsync<dynamic>(
             StoredProcedureConstants.Usp_GetTask,
             parameters,
             commandType: CommandType.StoredProcedure
         );
    }
    public async Task<CommonCreateResponse> AddTask(string addTaskJson)
    {
        var parameters = new DynamicParameters();
        parameters.Add("@TaskJson", addTaskJson, DbType.String);

        return await _dbConnection.QueryFirstOrDefaultAsync<CommonCreateResponse>(
            StoredProcedureConstants.Usp_Task,
            param: parameters,
            commandType: CommandType.StoredProcedure
        ) ?? new CommonCreateResponse();
    }

    public async Task<CommonCreateResponse> UpdateTask(Guid id, string updateTaskJson)
    {
        var parameters = new DynamicParameters();
        parameters.Add("@TaskJson", updateTaskJson, DbType.String);
        parameters.Add("@Id", id, DbType.Guid);

        return await _dbConnection.QueryFirstOrDefaultAsync<CommonCreateResponse>(
            StoredProcedureConstants.Usp_Task,
            param: parameters,
            commandType: CommandType.StoredProcedure
        ) ?? new CommonCreateResponse();
    }

    public async Task<CommonCreateResponse> DeleteTask(Guid id)
    {
        var deleteQuery = "Update Tasks Where IsActive = 0 Where TaskId = @Id";
        var rowAffected = await _dbConnection.ExecuteAsync(deleteQuery, new { Id = id });
        if (rowAffected > 0)
        {
            return new CommonCreateResponse { Status = 1, Message = "Task deleted successfully" };
        }
        return new CommonCreateResponse();
    }
}