namespace ProductServiceApi.Models.Dto
{
    public class ProductFilterDto
    {
        public List<string>? Countries { get; set; }
        public List<string>? Brands { get; set; }
        public decimal? MinPrice { get; set; }
        public decimal? MaxPrice { get; set; }
    }
}
