using BisiPro.Application.Interfaces;
using BisiPro.Application.Interfaces.Repositories;
using Microsoft.Extensions.Options;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;

namespace BisiPro.Infrastructure.AI.Gemini
{
    public class GeminiAIChatService : IAIChatService
    {
        private readonly HttpClient _httpClient;
        private readonly GeminiOptions _options;

        public GeminiAIChatService(
            HttpClient httpClient,
            IOptions<GeminiOptions> options)
        {
            _httpClient = httpClient;
            _options = options.Value;
        }

        public async Task<string> GenerateResponseAsync(
            string message,
            CancellationToken cancellationToken)
        {
            var url =
                $"https://generativelanguage.googleapis.com/v1beta/" +
                $"models/{_options.Model}:generateContent";

            var requestBody = new
            {
                contents = new[]
                {
                    new
                    {
                        role = "user",
                        parts = new[]
                        {
                            new
                            {
                                text = message
                            }
                        }
                    }
                }
            };

            using var request = new HttpRequestMessage(
                HttpMethod.Post,
                url);

            request.Headers.Add(
                "x-goog-api-key",
                _options.ApiKey);

            request.Content = new StringContent(
                JsonSerializer.Serialize(requestBody),
                Encoding.UTF8,
                "application/json");

            using var response = await _httpClient.SendAsync(
                request,
                cancellationToken);

            var responseContent =
                await response.Content.ReadAsStringAsync(
                    cancellationToken);

            if (!response.IsSuccessStatusCode)
            {
                throw new InvalidOperationException(
                    $"Gemini API request failed. " +
                    $"Status: {(int)response.StatusCode}. " +
                    $"Response: {responseContent}");
            }

            using var json =
                JsonDocument.Parse(responseContent);

            var text =
                json.RootElement
                    .GetProperty("candidates")[0]
                    .GetProperty("content")
                    .GetProperty("parts")[0]
                    .GetProperty("text")
                    .GetString();

            return text ?? string.Empty;
        }
    }
}