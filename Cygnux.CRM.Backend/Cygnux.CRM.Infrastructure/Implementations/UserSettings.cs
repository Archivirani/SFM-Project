using Cygnux.CRM.Infrastructure.Contracts;
using System.Text.Json.Serialization;

namespace Cygnux.CRM.Infrastructure.Implementations;

public class UserSettings : IUserSettings
{
    private static readonly AsyncLocal<string?> userId = new();
    [JsonIgnore]
    public string? UserId
    {
        get => userId.Value!;
        set => userId.Value = value;
    }

    [JsonIgnore]
    public string? ModifiedBy
    {
        get => userId.Value!;
        set => userId.Value = value;
    }

    [JsonIgnore]
    public string? CreatedBy
    {
        get => userId.Value!;
        set => userId.Value = value;
    }

}
