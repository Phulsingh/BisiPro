using BisiPro.Contracts.Common;
using MediatR;
using BisiPro.Contracts.DTO_s.Groups;

namespace BisiPro.Application.Features.Groups.Queries
{
    public record GetGroupByIdQuery(Guid GroupId)
    : IRequest<ApiResponse<GroupResponse>>;
}
