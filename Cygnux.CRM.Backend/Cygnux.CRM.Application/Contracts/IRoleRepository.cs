namespace Cygnux.CRM.Application.Contracts;

using Infrastructure.Models.Response;

public interface IRoleRepository
{
    Task<BaseResponse<CommonCreateResponse>> AddRole(string name);

    Task<BaseResponse<CommonCreateResponse>> UpdateRole(string id, string name);
}