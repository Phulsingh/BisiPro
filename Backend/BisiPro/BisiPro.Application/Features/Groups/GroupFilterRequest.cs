using BisiPro.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Text;

namespace BisiPro.Application.Features.Groups
{
    public class GroupFilterRequest
    {
        public string? Search { get; set; }
        public BisiType? BisiType { get; set; }
        public bool? IsActive { get; set; }
        public DateOnly? StartDateFrom { get; set; }
        public DateOnly? StartDateTo { get; set; }
        public string? SortBy { get; set; }
        public string? SortOrder { get; set; }
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 10;
    }
}
