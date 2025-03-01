using Cygnux.CRM.Infrastructure.Models.Response;

namespace Cygnux.CRM.Application.Contracts;

public interface IGeneralMasterRepository
{
    Task<BaseResponse<IEnumerable<GeneralMasterResponse>>> GetGeneralMasterList(string codeType, string? searchText, CancellationToken cancellationToken);
}
