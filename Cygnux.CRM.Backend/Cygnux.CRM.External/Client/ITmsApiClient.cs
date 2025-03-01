namespace Cygnux.CRM.External.Client;

using Models;

public interface ITmsApiClient
{
    Task<ApiClientResponse<List<GeneralMasterResponse?>>> SendGeneralMasterRequestAsync(string codeType, string searchText, CancellationToken cancellationToken);
    Task<ApiClientResponse<List<CustomerResponse?>>> SendCustomerMasterRequestAsync(CancellationToken cancellationToken);

    Task<ApiClientResponse<List<LocationMasterResponse?>>> SendLocationMasterRequestAsync(string userId, CancellationToken cancellationToken);
    Task<ApiClientResponse<LoginResponse>> SendLoginRequestAsync(string username, string password, CancellationToken cancellationToken);
    Task<ApiClientResponse<DocketDetailResponse>> SendDocketDetailRequestAsync(string docketNo, CancellationToken cancellationToken);
    Task<ApiClientResponse<List<CityResponse>>> SendCityMasterRequestAsync(CancellationToken cancellationToken);
    Task<ApiClientResponse<List<UserResponse?>>> SendUserMasterRequestAsync(CancellationToken cancellationToken);
}
