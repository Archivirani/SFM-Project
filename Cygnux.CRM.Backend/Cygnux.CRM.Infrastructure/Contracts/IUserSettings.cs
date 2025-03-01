namespace Cygnux.CRM.Infrastructure.Contracts;

public interface IUserSettings
{
    string? UserId { get; set; }
    string? CreatedBy { get; set; }
    string? ModifiedBy { get; set; }
}
