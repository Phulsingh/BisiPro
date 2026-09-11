using BisiPro.Contracts.Common;
using MediatR;
using BisiPro.Contracts.AI;


namespace BisiPro.Application.Features.AI.Gemini
{
    public class ChatCommand
        : IRequest<ApiResponse<ChatResponse>>
    {
        public string Message { get; set; } = string.Empty;

        public ChatCommand(string message)
        {
            Message = message;
        }
    }
}
