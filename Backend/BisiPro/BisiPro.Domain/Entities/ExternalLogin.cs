using BisiPro.Domain.Base;

namespace BisiPro.Domain.Entities
{
    public class ExternalLogin : AuditableEntity
    {
        public Guid UserId { get; set; }
        public string Provider { get; set; } = string.Empty;
        public string ProviderKey { get; set; } = string.Empty;
        public User User { get; set; } = null!;
    }
}