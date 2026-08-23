using BisiPro.Contracts.Common;
using BisiPro.Contracts.DTO_s.Users;
using MediatR;

namespace BisiPro.Application.Features.Users.Queries.GetUserById
{
    public class GetUserByIdQuery
        : IRequest<ApiResponse<UserResponse>>
    {
        public Guid Id { get; }

        public GetUserByIdQuery(Guid id)
        {
            Id = id;
        }
    }
}
