namespace Cygnux.CRM.Api.Controllers;

using Cygnux.CRM.Application.Contracts;
using Cygnux.CRM.Infrastructure.Contracts;
using CygnuxLSP.API.Models;
using External.Client;
using Microsoft.AspNetCore.Mvc;


[Route("api/v{version:apiVersion}/[controller]")]
[ApiController]
public class ExternalController : ControllerBase
{
    private readonly ITmsApiClient _tmsApiClient;
    private readonly IGeneralMasterRepository _generalMasterRepository;
    private readonly IUserSettings _userSettings;
    public ExternalController(ITmsApiClient tmsApiClient,
        IGeneralMasterRepository generalMasterRepository,
        IAuthRepository authRepository,
        IUserSettings userSettings)
    {
        _tmsApiClient = tmsApiClient;
        _generalMasterRepository = generalMasterRepository;
        _userSettings = userSettings;
    }
    [HttpGet]
    [Route("{codeType}")]
    public async Task<IActionResult> GetGeneralMaster(string codeType, [FromQuery] string? searchText, CancellationToken cancellationToken)
    {
        return Ok(await _generalMasterRepository.GetGeneralMasterList(codeType, searchText, cancellationToken));
    }

    [HttpGet]
    [Route("location")]
    public async Task<IActionResult> GetLocationMaster(CancellationToken cancellationToken)
    {
        return Ok(await _tmsApiClient.SendLocationMasterRequestAsync(_userSettings.UserId!, cancellationToken));
    }

    [HttpPost]
    [Route("login")]
    public async Task<IActionResult> Login(UserLogin loginRequest, CancellationToken cancellationToken)
    {
        var response = await _tmsApiClient.SendLoginRequestAsync(loginRequest.Username, loginRequest.Password, cancellationToken);
        if (!response.IsSuccess)
        {
            return NotFound(new { Message = response.ErrorMessage });
        }
        return Ok(response);
    }

    [HttpGet]
    [Route("docket/{docketNo}")]
    public async Task<IActionResult> GetDocketDetail(string docketNo, CancellationToken cancellationToken)
    {
        return Ok(await _tmsApiClient.SendDocketDetailRequestAsync(docketNo, cancellationToken));
    }
    [HttpGet]
    [Route("city")]
    public async Task<IActionResult> GetCity(CancellationToken cancellationToken)
    {
        return Ok(await _tmsApiClient.SendCityMasterRequestAsync(cancellationToken));
    }
    [HttpGet]
    [Route("customer")]
    public async Task<IActionResult> GetCustomers(CancellationToken cancellationToken)
    {
        return Ok(await _tmsApiClient.SendCustomerMasterRequestAsync(cancellationToken));
    }
    [HttpGet]
    [Route("user")]
    public async Task<IActionResult> GetUsers(CancellationToken cancellationToken)
    {
        return Ok(await _tmsApiClient.SendUserMasterRequestAsync(cancellationToken));
    }
}
