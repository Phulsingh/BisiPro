using BisiPro.Domain.Base;


namespace BisiPro.Domain.Entities
{
    public class GroupAgent : AuditableEntity
    {
        public Guid GroupId { get; set; }
        public Guid AgentId { get; set; }
        public Group Group { get; set; } = null!;
        public User Agent { get; set; } = null!;
    }
}
