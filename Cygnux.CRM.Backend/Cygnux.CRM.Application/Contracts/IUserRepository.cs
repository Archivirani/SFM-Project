namespace Cygnux.CRM.Application.Contracts;

using Infrastructure.Models.Response;
using Models.Request;

public interface IUserRepository
{
    Task<BaseResponse<CommonCreateResponse>> AddUser(UserRequest userRequest);

    Task<BaseResponse<CommonCreateResponse>> UpdateUser(string id, UserRequest userRequest);
}