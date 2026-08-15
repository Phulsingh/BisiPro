using BisiPro.Domain.Base;

namespace BisiPro.Domain.Entities
{
    public class GroupMember : AuditableEntity
    {
        public Guid GroupId { get; set; }
        public Guid UserId { get; set; }
        public decimal PayableAmount { get; set; }
        public DateOnly JoinedDate { get; set; }
        public DateOnly? ExitDate { get; set; }
        public bool IsActive { get; set; } = true;
        // Navigation Properties
        public Group Group { get; set; } = null!;
        public User User { get; set; } = null!;
    }
}
