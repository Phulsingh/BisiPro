using BisiPro.Application.Features.AI.Gemini;
using BisiPro.Application.Interfaces.Repositories;
using BisiPro.Contracts.AI;
using BisiPro.Contracts.Common;
using MediatR;

namespace BisiPro.Application.Features.AI.Chat
{
    public class ChatCommandHandler
        : IRequestHandler<
            ChatCommand,
            ApiResponse<ChatResponse>>
    {
        private readonly IAIChatService _aiChatService;

        public ChatCommandHandler(
            IAIChatService aiChatService)
        {
            _aiChatService = aiChatService;
        }

        public async Task<ApiResponse<ChatResponse>> Handle(
            ChatCommand command,
            CancellationToken cancellationToken)
        {
            if (string.IsNullOrWhiteSpace(command.Message))
            {
                return new ApiResponse<ChatResponse>
                {
                    IsSuccess = false,
                    Error = "Message is required."
                };
            }

            var response =
                await _aiChatService.GenerateResponseAsync(
                    command.Message,
                    cancellationToken);

            return new ApiResponse<ChatResponse>
            {
                IsSuccess = true,
                Data = new ChatResponse
                {
                    Message = response
                }
            };
        }
    }
}