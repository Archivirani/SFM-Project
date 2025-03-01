using Cygnux.CRM.Application.Contracts;
using Cygnux.CRM.Application.Models.Request.Auth;
using Cygnux.CRM.Infrastructure.Models.Response;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Text;

namespace Cygnux.CRM.Api.Controllers
{
    [Route("api/v{version:apiVersion}/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly IAuthRepository  _authRepository;
        public AuthController(IConfiguration configuration, IAuthRepository authRepository)
        {
            _configuration = configuration;
            _authRepository = authRepository;
        }
        [HttpPost("validate")]
        public IActionResult ValidateToken([FromBody] TokenRequest request)
        {
            if (ValidateJwtToken(request.Token))
            {
                return Ok(new BaseResponse<object>(new { isValid = true }));
            }
            return Ok(new BaseResponse<object>(new ErrorResponse { Message = "You are not authorize for SSO, Please contact administrator" }));
        }

        private bool ValidateJwtToken(string token)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
            var tokenHandler = new JwtSecurityTokenHandler();

            try
            {
                _ = tokenHandler.ValidateToken(token, new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = false,
                    IssuerSigningKey = key,
                    ValidateIssuer = true,
                    ValidIssuer = _configuration["Jwt:Issuer"],
                    ValidateAudience = true,
                    ValidAudience = _configuration["Jwt:Audience"],
                }, out SecurityToken _);

                return true;
            }
            catch
            {
                return false;
            }
        }


        [HttpPost("refresh-token")]
        public async Task<IActionResult> RefreshToken([FromBody] TokenRequest request)
        {
            return Ok(await _authRepository.GetRefreshTokenAsync(request));
        }

        [HttpPost("generate-refresh-token")]
        public async Task<IActionResult> GenerateRefreshToken([FromBody] TokenRequest request)
        {
            return Ok(await _authRepository.GenerateRefreshTokenAsync(request.UserId));
        }
    }
}
