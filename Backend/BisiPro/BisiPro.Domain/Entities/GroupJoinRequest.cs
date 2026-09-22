using BisiPro.Domain.Base;
using BisiPro.Domain.Enums;
namespace BisiPro.Domain.Entities
{
    public class GroupJoinRequest : AuditableEntity
    {
        public Guid GroupId { get; set; }
        public Guid UserId { get; set; }
        public JoinRequestStatus Status { get; set; }
            = JoinRequestStatus.Pending;
        public DateTime RequestedAt { get; set; }
        public DateTime? ReviewedAt { get; set; }
        public Guid? ReviewedBy { get; set; }
        public string? RejectionReason { get; set; }
        public Group Group { get; set; } = null!;
        public User User { get; set; } = null!;
    }
}
