using BisiPro.Domain.Base;
using BisiPro.Domain.Enums;

namespace BisiPro.Domain.Entities
{
    public class User : AuditableEntity
    {
        public required string FirstName { get; set; } = string.Empty;
        public required string LastName { get; set; } = string.Empty;
        public required string Email { get; set; } = string.Empty;
        public required DateOnly DateOfBirth { get; set; }
        public required string PhoneNumber { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public bool IsActive { get; set; } = true;
        public Guid RoleId { get; set; }
        public Role Role { get; set; } = null!;

        // KYC
        public KycStatus KycStatus { get; set; } = KycStatus.Pending;
        // Nominee
        public string? NomineeName { get; set; }
        public string? NomineePhoneNumber { get; set; }
        // Village
        public string? Village { get; set; }

        // Group memberships
        public ICollection<GroupMember> GroupMemberships { get; set; }
            = new List<GroupMember>();
    }
}
