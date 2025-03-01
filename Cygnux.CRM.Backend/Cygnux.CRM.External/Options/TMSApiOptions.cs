namespace Cygnux.CRM.External.Options
{
    public class TMSApiOptions
    {
        public const string TmsApis = nameof(TmsApis);
        public string HostUrl { get; set; } = string.Empty;
        public string Token { get; set; } = string.Empty;

        public string GeneralMasterUrl { get; set; } = string.Empty;

        public string CustomerMasterUrl { get; set; } = string.Empty;

        public string LocationMasterUrl { get; set; } = string.Empty;
        public string LoginUrl { get; set; } = string.Empty;

        public string DocketDetailUrl { get; set; } = string.Empty;

        public string UserMasterUrl { get; set; } = string.Empty;

        public string CityUrl { get; set; } = string.Empty;
    }
}
