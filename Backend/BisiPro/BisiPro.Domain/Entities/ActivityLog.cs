using BisiPro.Domain.Base;
using System;
using System.Collections.Generic;
using System.Text;

namespace BisiPro.Domain.Entities
{
    public class ActivityLog : BaseEntity
    {
        public string ActivityType { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public Guid? UserId { get; set; }
        public Guid? GroupId { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
