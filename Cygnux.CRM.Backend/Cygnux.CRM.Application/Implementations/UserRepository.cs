namespace Cygnux.CRM.Application.Implementations;

using Contracts;
using External.Contracts;
using External.Entities;
using Infrastructure.Models.Response;
using Models.Request;
internal class UserRepository : IUserRepository
{
    private readonly IUserService _userService;

    public UserRepository(IUserService userService)
    {
        _userService = userService;
    }

    public async Task<BaseResponse<CommonCreateResponse>> AddUser(UserRequest userRequest)
    {
        var response = await _userService.AddUser(new ApplicationUser
        {
            FirstName = userRequest.FirstName,
            LastName = userRequest.LastName,
            Email = userRequest.EmailId,
            UserName = userRequest.EmailId,
            PhoneNumber = userRequest.ContactNumber,
            EntryBy = Guid.NewGuid().ToString(),
            EntryDate = DateTime.Now,
            PasswordHash = userRequest.Password
        });

        return new BaseResponse<CommonCreateResponse>(new CommonCreateResponse { Status = response.Succeeded ? 1 : 0, Message = "Done" });
    }

    public async Task<BaseResponse<CommonCreateResponse>> UpdateUser(string id, UserRequest userRequest)
    {
        var response = await _userService.UpdateUser(id, new ApplicationUser
        {
            FirstName = userRequest.FirstName,
            LastName = userRequest.LastName,
            PhoneNumber = userRequest.ContactNumber
        });

        return new BaseResponse<CommonCreateResponse>(new CommonCreateResponse { Status = response.Succeeded ? 1 : 0, Message = "Done" });
    }
}