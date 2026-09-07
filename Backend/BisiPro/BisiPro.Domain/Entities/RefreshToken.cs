using BisiPro.Domain.Base;
using System;
using System.Collections.Generic;
using System.Text;

namespace BisiPro.Domain.Entities
{
    public class RefreshToken : BaseEntity
    {
        public Guid UserId { get; set; }
        public string TokenHash { get; set; } = string.Empty;
        public DateTime ExpiresAt { get; set; }
        public DateTime? RevokedAt { get; set; }
        public DateTime CreatedAt { get; set; }
        public User User { get; set; } = null!;
    }
}
