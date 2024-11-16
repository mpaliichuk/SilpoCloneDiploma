using FrontEnd.Models.Dto;
using System.Net.Http;
using System.Net.Http.Json;
using Microsoft.Extensions.Logging;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Linq;

namespace FrontEnd.Services
{
    public class ProductCategoryRatingService
    {
        private readonly HttpClient _httpClient;
        private readonly ILogger<ProductCategoryRatingService> _logger;
        private const string BaseUrl = "http://localhost:5296";

        // Constructor that initializes HttpClient and Logger
        public ProductCategoryRatingService(HttpClient httpClient, ILogger<ProductCategoryRatingService> logger)
        {
            _httpClient = httpClient;
            _httpClient.BaseAddress = new Uri(BaseUrl);
            _logger = logger;
        }

        // Helper method to send HTTP requests with specified method, URL, and optional data
        private async Task<T> SendRequestAsync<T>(HttpMethod method, string url, T data = default)
        {
            var request = new HttpRequestMessage(method, url)
            {
                Content = data != null ? JsonContent.Create(data) : null
            };

            var response = await _httpClient.SendAsync(request);
            if (!response.IsSuccessStatusCode)
            {
                var errorContent = await response.Content.ReadAsStringAsync();
                _logger.LogError($"Request failed. Status code: {response.StatusCode}, Error: {errorContent}");
                return default;
            }

            return await response.Content.ReadFromJsonAsync<T>();
        }

        // Get a list of products with pagination
        public async Task<List<ProductDto>> GetProductsAsync(int pageNumber, int pageSize)
        {
            try
            {
                var url = $"/gateway/product?pageNumber={pageNumber}&pageSize={pageSize}"; // URL with pagination parameters
                return await _httpClient.GetFromJsonAsync<List<ProductDto>>(url);
            }
            catch (Exception ex)
            {
                _logger.LogError($"An error occurred while fetching products: {ex.Message}");
                return new List<ProductDto>(); // Return an empty list instead of null
            }
        }

        // Get a product by ID
        public async Task<ProductDto> GetProductByIdAsync(int id)
        {
            try
            {
                var url = $"/gateway/product/{id}";
                var product = await _httpClient.GetFromJsonAsync<ProductDto>(url);

                if (product == null)
                {
                    throw new InvalidOperationException($"Product with id {id} not found.");
                }

                return product;
            }
            catch (HttpRequestException ex)
            {
                _logger.LogError($"HTTP request error while fetching product with id {id}: {ex.Message}");
                throw;
            }
            catch (Exception ex)
            {
                _logger.LogError($"An error occurred while fetching product with id {id}: {ex.Message}");
                throw;
            }
        }

        // Create a new product
        public async Task<ProductDto> CreateProductAsync(ProductDto product)
        {
            return await SendRequestAsync<ProductDto>(HttpMethod.Post, "/gateway/product", product); // Specify the type explicitly
        }

        // Update an existing product
        public async Task<ProductDto> UpdateProductAsync(int id, ProductDto product)
        {
            return await SendRequestAsync<ProductDto>(HttpMethod.Put, $"/gateway/product/{id}", product); // Specify the type explicitly
        }

        // Delete a product by ID
        public async Task<bool> DeleteProductAsync(int id)
        {
            try
            {
                var response = await _httpClient.DeleteAsync($"/gateway/product/{id}");
                if (!response.IsSuccessStatusCode)
                {
                    var errorContent = await response.Content.ReadAsStringAsync();
                    _logger.LogError($"Failed to delete product with id {id}. Status code: {response.StatusCode}, Error: {errorContent}");
                    return false;
                }
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError($"An error occurred while deleting product with id {id}: {ex.Message}");
                return false;
            }
        }

        // Get a list of categories
        public async Task<List<CategoryDto>> GetCategoriesAsync()
        {
            try
            {
                _logger.LogInformation("Fetching categories...");
                var response = await _httpClient.GetFromJsonAsync<List<CategoryDto>>("/gateway/category");

                if (response == null)
                {
                    _logger.LogWarning("No categories returned.");
                }

                return response ?? new List<CategoryDto>(); // Return an empty list if null
            }
            catch (Exception ex)
            {
                _logger.LogError($"An error occurred while fetching categories: {ex.Message}");
                return new List<CategoryDto>(); // Return an empty list in case of error
            }
        }


        // Get a category by ID
        public async Task<CategoryDto> GetCategoryByIdAsync(int id)
        {
            return await SendRequestAsync<CategoryDto>(HttpMethod.Get, $"/gateway/category/{id}"); // Specify the type explicitly
        }

        // Create a new category
        public async Task<CategoryDto> CreateCategoryAsync(CategoryDto category)
        {
            return await SendRequestAsync<CategoryDto>(HttpMethod.Post, "/gateway/category", category); // Specify the type explicitly
        }

        // Update an existing category
        public async Task<CategoryDto> UpdateCategoryAsync(int id, CategoryDto category)
        {
            return await SendRequestAsync<CategoryDto>(HttpMethod.Put, $"/gateway/category/{id}", category); // Specify the type explicitly
        }

        // Delete a category by ID
        public async Task<bool> DeleteCategoryAsync(int id)
        {
            return await SendRequestAsync<CategoryDto>(HttpMethod.Delete, $"/gateway/category/{id}") != null; // Specify the type explicitly
        }

        // Get a list of ratings
        public async Task<List<RatingDto>> GetRatingsAsync()
        {
            return await SendRequestAsync<List<RatingDto>>(HttpMethod.Get, "/gateway/rating"); // Specify the type explicitly
        }

        // Get a rating by ID
        public async Task<RatingDto> GetRatingByIdAsync(int id)
        {
            return await SendRequestAsync<RatingDto>(HttpMethod.Get, $"/gateway/rating/{id}"); // Specify the type explicitly
        }

        // Create a new rating
        public async Task<RatingDto> CreateRatingAsync(RatingDto rating)
        {
            return await SendRequestAsync<RatingDto>(HttpMethod.Post, "/gateway/rating", rating); // Specify the type explicitly
        }

        // Update an existing rating
        public async Task<RatingDto> UpdateRatingAsync(int id, RatingDto rating)
        {
            return await SendRequestAsync<RatingDto>(HttpMethod.Put, $"/gateway/rating/{id}", rating); // Specify the type explicitly
        }

        // Delete a rating by ID
        public async Task<bool> DeleteRatingAsync(int id)
        {
            return await SendRequestAsync<RatingDto>(HttpMethod.Delete, $"/gateway/rating/{id}") != null; // Specify the type explicitly
        }

        // Get products in a specific category
        public async Task<List<ProductDto>> GetProductsInCategoryAsync(CategoryDto category, int pageNumber, int pageSize)
        {
            try
            {
                var allProducts = await GetProductsAsync(pageNumber, pageSize);
                var productsInCategory = allProducts.Where(p => p.CategoryId == category.Id).ToList();
                return productsInCategory;
            }
            catch (Exception ex)
            {
                _logger.LogError($"An error occurred while fetching products in category {category}: {ex.Message}");
                return new List<ProductDto>(); // Return an empty list instead of null
            }
        }
    }
}
