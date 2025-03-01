using Cygnux.CRM.Infrastructure.Models.Response;

namespace Cygnux.CRM.Infrastructure.Contracts;

public interface IGeneralMasterService
{
    Task<IEnumerable<GeneralMasterResponse>> GetGeneralMasterList(string codeType, string? searchText, CancellationToken cancellationToken);
}
