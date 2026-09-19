using BisiPro.Contracts.Common;
using BisiPro.Contracts.DTO_s.Users;
using MediatR;


namespace BisiPro.Application.Features.Users.Queries.AgentDropdown
{
    public class GetAgentsDropdownQuery : IRequest<ApiResponse<PagedResponse<AgentDropdownResponse>>>
    {
        public AgentFilterRequest Filter { get; }
        public GetAgentsDropdownQuery(AgentFilterRequest filter)
        {
            Filter = filter;
        }
    }
}
