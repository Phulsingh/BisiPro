namespace BisiPro.Contracts.Common
{
    public class ApiResponse<T>
    {
        public T? Data { get; set; }
        public bool IsSuccess { get; set; } 
        public string? Error { get; set; }
        public List<string> Errors { get; set; } = new();
    }
}
