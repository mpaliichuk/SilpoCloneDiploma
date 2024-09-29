using AutoMapper;

namespace ShopingCartServiceApi
{
    public class MappingConfig
    {
        public static MapperConfiguration RegisterMaps()
        {
            var mappingConfig = new MapperConfiguration(config =>
            {
                config.CreateMap<Models.CartHeader, Models.Dto.CartHeaderDto>().ReverseMap();
                config.CreateMap<Models.CartDetails, Models.Dto.CartDetailsDto>().ReverseMap();
            });

            return mappingConfig;
        }
    }
}
