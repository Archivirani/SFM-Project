namespace Cygnux.CRM.Api.Controllers;

using Application.Contracts;
using Application.Models.Request;
using Microsoft.AspNetCore.Mvc;

[Route("api/v{version:apiVersion}/[controller]")]
[ApiController]
public class TaskController : ControllerBase
{
    private readonly ITaskRepository _taskRepository;

    public TaskController(ITaskRepository TaskRepository)
    {
        _taskRepository = TaskRepository;
    }

    [HttpGet]
    public async Task<IActionResult> GetTaskList([FromQuery] Dictionary<string, string> filters)
    {
        return Ok(await _taskRepository.GetTaskList(filters));
    }

    [HttpGet]
    [Route("{id}")]
    public async Task<IActionResult> GetTaskDetails(Guid id)
    {
        return Ok(await _taskRepository.GetTaskDetails(id));
    }

    [HttpGet("export")]
    public async Task<IActionResult> ExportTask([FromQuery] Dictionary<string, string> filters)
    {
        return Ok(await _taskRepository.ExportTask(filters));
    }

    [HttpPost]
    public async Task<IActionResult> AddTask(CreateTaskRequest createTask)
    {
        return Ok(await _taskRepository.AddTask(createTask));
    }

    [HttpPost("{id}")]
    public async Task<IActionResult> UpdatedTask(Guid id, CreateTaskRequest createTask)
    {
        return Ok(await _taskRepository.UpdateTask(id, createTask));
    }

    [HttpPatch("{id}")]
    public async Task<IActionResult> DeleteTask(Guid id)
    {
        return Ok(await _taskRepository.DeleteTask(id));
    }
}