namespace Cygnux.CRM.External.Models
{
    public class BaseCityResponse
    {
        public string Location { get; set; } = string.Empty;

        public List<CityResponse> CityList { get; set; }
    }
}
