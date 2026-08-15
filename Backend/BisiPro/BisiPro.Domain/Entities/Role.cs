using BisiPro.Domain.Base;
using System;
using System.Collections.Generic;
using System.Text;

namespace BisiPro.Domain.Entities
{
    public class Role : AuditableEntity
    { 
        public required string Name { get; set; } = string.Empty;
        public required string Description { get; set; } = string.Empty;
        public bool IsActive { get; set; } = true;
        public ICollection<User> Users { get; set; } = new List<User>();
    }
}
