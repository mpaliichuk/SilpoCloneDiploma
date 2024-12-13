    namespace AuthAPI.Models.Dto
    {
        public class ResponseDto
        {
            public string Message { get; set; }
            public bool IsSuccess { get; set; }
            public object? Result { get; set; }
        }
    }
