# BisiPro --- Technical Requirements Document (TRD)

**Project:** BisiPro\
**Document Type:** Technical Requirements Document\
**Version:** 1.0\
**Status:** Active Development\
**Primary Backend:** .NET 10 / C# / ASP.NET Core\
**Database:** SQL Server / SSMS\
**ORM:** Entity Framework Core\
**Web Frontend:** React JS / TypeScript\
**Styling:** Tailwind CSS + Bootstrap\
**UI Components:** shadcn/ui\
**Mobile:** React Native\
**Development Utilities:** skills.sh / skills files where applicable

------------------------------------------------------------------------

# 1. Technical Overview

BisiPro is a full-stack application for managing Bisi/Chit-style
rotating savings groups.

The system will be developed as a multi-client platform:

``` text
                    BisiPro Platform
                          │
             ┌────────────┼────────────┐
             │            │            │
             ▼            ▼            ▼
        Web Application Mobile App  Future Clients
             │            │
        React JS      React Native
             │            │
             └──────┬─────┘
                    │
                    ▼
              RESTful API
                    │
                    ▼
              ASP.NET Core
                 .NET 10
                    │
          ┌─────────┴─────────┐
          │                   │
          ▼                   ▼
     Application Layer   Infrastructure
          │                   │
          └─────────┬─────────┘
                    ▼
               EF Core
                    │
                    ▼
               SQL Server
                    │
                   SSMS
```

The backend will be the central source of truth for business rules,
authorization, financial calculations, validation, and persistence.

------------------------------------------------------------------------

# 2. Technology Stack

## 2.1 Backend

  Technology                   Purpose
  ---------------------------- -------------------------------
  .NET 10                      Backend platform
  ASP.NET Core                 REST API
  C#                           Backend programming language
  MediatR                      CQRS request/handler pipeline
  FluentValidation             Request validation
  Entity Framework Core        ORM / data access
  SQL Server                   Relational database
  SSMS                         Database administration
  JWT                          Authentication
  Microsoft password hashing   Secure password storage

------------------------------------------------------------------------

# 3. Frontend Web Stack

  Technology      Purpose
  --------------- ------------------------------------------
  React JS        Web application framework/library
  TypeScript      Static typing
  Tailwind CSS    Utility-first styling
  Bootstrap       Layout/utilities and selected UI support
  shadcn/ui       Reusable accessible UI components
  React Router    Client-side routing
  Axios / Fetch   API communication

The exact frontend package versions should be pinned in the project
package manifest.

------------------------------------------------------------------------

# 4. Mobile Stack

The mobile application will use:

``` text
React Native
```

The mobile application will consume the same BisiPro REST APIs used by
the web application.

Architecture:

``` text
React Native
     ↓
API Client
     ↓
BisiPro REST API
     ↓
ASP.NET Core
     ↓
SQL Server
```

The mobile client must not directly access SQL Server.

------------------------------------------------------------------------

# 5. Development Skills / skills.sh

The project may use `skills.sh` and related skill files as development
assistance for:

-   UI generation
-   React development
-   Tailwind development
-   shadcn/ui usage
-   React Native development
-   Testing
-   Documentation
-   Development workflows

Skills are development-time tooling and are not part of the production
runtime architecture.

Any generated implementation must still follow the project's
architecture, security rules, coding standards, and review process.

------------------------------------------------------------------------

# 6. Backend Architecture

BisiPro backend follows a Clean Architecture-inspired layered
architecture combined with CQRS and the Repository Pattern.

Current solution:

``` text
BisiPro
│
├── BisiPro.Api
├── BisiPro.Application
├── BisiPro.Contracts
├── BisiPro.Domain
├── BisiPro.Infrastructure
└── BisiPro.Shared
```

------------------------------------------------------------------------

# 7. BisiPro.Api

Responsibilities:

-   HTTP endpoints
-   Controllers
-   Authentication boundary
-   Authorization attributes
-   Reading route parameters
-   Reading authenticated user claims
-   Dispatching commands and queries
-   Returning HTTP responses

Controllers must remain thin.

Example:

``` text
HTTP Request
    ↓
Controller
    ↓
MediatR
    ↓
Handler
```

Controllers should not contain substantial business logic.

------------------------------------------------------------------------

# 8. BisiPro.Application

Responsibilities:

-   Business use cases
-   CQRS commands
-   CQRS queries
-   Command handlers
-   Query handlers
-   FluentValidation validators
-   Pipeline behaviors
-   Repository interfaces
-   Application mappings

Example:

``` text
Features/
├── Authentication/
├── Groups/
├── GroupMembers/
├── Users/
└── ...
```

------------------------------------------------------------------------

# 9. BisiPro.Contracts

The Contracts project contains objects shared across API boundaries.

Examples:

``` text
Contracts/
├── Common/
│   ├── ApiResponse
│   ├── ErrorResponse
│   └── PagedResponse
│
└── DTO_s/
    ├── Groups/
    ├── GroupMembers/
    ├── Users/
    └── ...
```

Contracts should not expose internal domain implementation details
unnecessarily.

------------------------------------------------------------------------

# 10. BisiPro.Domain

The Domain layer contains the core domain model.

Examples:

``` text
Domain/
├── Entities/
├── Enums/
└── Base/
```

Current major entities:

``` text
User
Role
Group
GroupMember
```

Domain entities should remain independent of Infrastructure concerns.

------------------------------------------------------------------------

# 11. BisiPro.Infrastructure

Responsibilities:

-   EF Core
-   ApplicationDbContext
-   SQL Server configuration
-   Repository implementations
-   Authentication implementation
-   JWT implementation
-   Password hashing implementation
-   Database migrations
-   Infrastructure dependency injection

------------------------------------------------------------------------

# 12. Database Technology

The database will use:

``` text
Microsoft SQL Server
```

Database development and administration will be performed using:

``` text
SQL Server Management Studio (SSMS)
```

Example database:

``` text
BisiProDb
```

------------------------------------------------------------------------

# 13. Entity Framework Core

EF Core will be the primary ORM.

The application uses:

``` csharp
ApplicationDbContext
```

Example DbSets:

``` csharp
public DbSet<User> Users { get; set; }
public DbSet<Role> Roles { get; set; }
public DbSet<Group> Groups { get; set; }
public DbSet<GroupMember> GroupMembers { get; set; }
```

EF Core will handle:

-   Entity mapping
-   Relationships
-   Queries
-   Inserts
-   Updates
-   Deletes
-   Migrations
-   Transactions where required

------------------------------------------------------------------------

# 14. EF Core Configuration

Entity configuration should preferably be separated into configuration
classes where practical.

Example:

``` text
Infrastructure/
└── Persistence/
    ├── ApplicationDbContext.cs
    └── Configurations/
        ├── UserConfiguration.cs
        ├── RoleConfiguration.cs
        ├── GroupConfiguration.cs
        └── GroupMemberConfiguration.cs
```

The DbContext can load configurations using:

``` csharp
modelBuilder.ApplyConfigurationsFromAssembly(
    typeof(ApplicationDbContext).Assembly);
```

This keeps `ApplicationDbContext` clean.

------------------------------------------------------------------------

# 15. Database Migrations

EF Core migrations will be used for schema changes.

Typical workflow:

``` powershell
Add-Migration MigrationName
Update-Database
```

Migration names should clearly describe the change.

Examples:

``` text
InitialCreate
AddGroupMemberAndUserChanges
UpdateGroupMemberModel
```

Existing migrations should not be modified manually after they have been
applied to shared/production environments unless there is a controlled
migration strategy.

------------------------------------------------------------------------

# 16. Core Database Relationships

## Role → User

``` text
Role 1 ───── N Users
```

## Agent/User → Group

``` text
Agent 1 ───── N Groups
```

## Group → GroupMember

``` text
Group 1 ───── N GroupMembers
```

## User → GroupMember

``` text
User 1 ───── N GroupMemberships
```

Therefore Group and User are connected through GroupMember.

------------------------------------------------------------------------

# 17. GroupMember Database Constraint

The GroupMember table uses a unique composite index:

``` text
GroupId + UserId
```

This prevents duplicate membership records for the same User and Group.

Example EF Core configuration:

``` csharp
entity.HasIndex(x => new
{
    x.GroupId,
    x.UserId
})
.IsUnique();
```

------------------------------------------------------------------------

# 18. Delete Behavior

GroupMember foreign keys should use restricted deletion where
appropriate:

``` csharp
.OnDelete(DeleteBehavior.Restrict);
```

This prevents accidental cascading deletion of important membership
data.

The application should use explicit business operations for member
exit/deactivation.

------------------------------------------------------------------------

# 19. Entity Base Classes

The project uses base entities for common properties.

Typical fields include:

``` text
Id
CreatedAt
CreatedBy
UpdatedAt
UpdatedBy
```

Auditable entities inherit common audit behavior.

Example:

``` text
BaseEntity
    ↓
AuditableEntity
    ↓
User / Group / GroupMember
```

------------------------------------------------------------------------

# 20. Authentication Architecture

BisiPro uses JWT-based authentication.

Flow:

``` text
User Login
    ↓
Validate Credentials
    ↓
Verify Password Hash
    ↓
Generate JWT
    ↓
Return Token
    ↓
Client Stores Token
    ↓
Authorization Header
    ↓
Protected API
```

HTTP header:

``` http
Authorization: Bearer <JWT>
```

------------------------------------------------------------------------

# 21. JWT Claims

The authenticated user's identity will be available through claims.

The application currently uses:

``` csharp
User.FindFirstValue(ClaimTypes.NameIdentifier)
```

to obtain the authenticated Agent/User ID.

Important rule:

> AgentId must come from the authenticated JWT, not from an untrusted
> request body.

------------------------------------------------------------------------

# 22. Authorization

Protected endpoints use:

``` csharp
[Authorize]
```

Example:

``` csharp
[Authorize]
[ApiController]
[Route("api/[controller]")]
public class GroupController : ControllerBase
{
}
```

Authorization must be enforced at the application/business level for
resource ownership.

------------------------------------------------------------------------

# 23. Agent Ownership

Groups contain:

``` text
AgentId
```

Every Agent-specific group operation must verify:

``` text
Group.AgentId == CurrentAuthenticatedAgentId
```

This applies to:

-   Get Group
-   Update Group
-   Delete Group
-   Group Details
-   Add Group Member
-   Group Member operations

This prevents IDOR-style resource access where an Agent changes a URL
and accesses another Agent's data.

------------------------------------------------------------------------

# 24. CQRS

The application follows CQRS.

## Commands

Commands modify state.

Examples:

``` text
RegisterCommand
CreateGroupCommand
UpdateGroupCommand
DeleteGroupCommand
CreateGroupMemberCommand
```

## Queries

Queries retrieve data.

Examples:

``` text
GetAllGroupsQuery
GetGroupDetailsQuery
GetGroupMembersQuery
```

------------------------------------------------------------------------

# 25. MediatR

MediatR connects API controllers to Application handlers.

Example:

``` text
Controller
    ↓
_mediator.Send(command)
    ↓
CommandHandler
    ↓
Repository
```

For queries:

``` text
Controller
    ↓
_mediator.Send(query)
    ↓
QueryHandler
    ↓
Repository
```

------------------------------------------------------------------------

# 26. Repository Pattern

The Application layer defines repository interfaces.

Example:

``` csharp
public interface IGroupRepository
{
    Task<Group?> GetByIdAsync(
        Guid id,
        CancellationToken cancellationToken);

    Task<List<Group>> GetByAgentIdAsync(
        Guid agentId,
        CancellationToken cancellationToken);
}
```

Infrastructure implements the interface.

``` text
Application
    ↓
IGroupRepository
    ↓
Infrastructure
    ↓
GroupRepository
    ↓
EF Core
```

------------------------------------------------------------------------

# 27. Read Queries and Tracking

Read-only EF Core queries should use:

``` csharp
AsNoTracking()
```

where entity tracking is unnecessary.

Example:

``` csharp
return await _context.Groups
    .AsNoTracking()
    .FirstOrDefaultAsync(
        x => x.Id == id,
        cancellationToken);
```

This reduces unnecessary EF Core tracking overhead.

------------------------------------------------------------------------

# 28. Include Strategy

Related data should be loaded intentionally.

Example:

``` csharp
_context.Groups
    .Include(x => x.Members)
    .ThenInclude(x => x.User)
```

This is used when Group Details requires member and user information.

Avoid loading large relationship graphs unnecessarily.

------------------------------------------------------------------------

# 29. API Response Contracts

The API uses a common response structure.

Example:

``` json
{
  "data": {},
  "isSuccess": true,
  "error": null,
  "errors": []
}
```

Paged APIs use:

``` json
{
  "pageNumber": 1,
  "pageSize": 10,
  "totalCount": 52,
  "totalPages": 6,
  "hasPrevious": false,
  "hasNext": true,
  "data": [],
  "isSuccess": true,
  "error": null,
  "errors": []
}
```

------------------------------------------------------------------------

# 30. Pagination

Collection endpoints must use pagination when large datasets are
possible.

Parameters:

``` text
PageNumber
PageSize
```

Backend logic:

``` csharp
var pageNumber = filter.PageNumber < 1
    ? 1
    : filter.PageNumber;

var pageSize = filter.PageSize < 1
    ? 10
    : filter.PageSize;

var data = await query
    .Skip((pageNumber - 1) * pageSize)
    .Take(pageSize)
    .ToListAsync(cancellationToken);
```

The total count must be calculated before pagination:

``` csharp
var totalCount = await query.CountAsync(
    cancellationToken);
```

------------------------------------------------------------------------

# 31. Filtering and Sorting

Group filtering supports:

-   Group name/search
-   Bisi type
-   Active status
-   Start date
-   End date
-   Collection day
-   Auction day

Sorting supports:

-   Sort field
-   Sort order

Minimum and maximum monthly amount filters are intentionally excluded
from the current Group filter design.

------------------------------------------------------------------------

# 32. Validation

FluentValidation is used for application request validation.

Architecture:

``` text
Controller
    ↓
MediatR
    ↓
ValidationBehavior
    ↓
FluentValidation
    ↓
Handler
```

Validators should handle input validation.

Business rules belong in handlers/services.

------------------------------------------------------------------------

# 33. Example Group Validation

``` text
GroupName:
Required
Max 100

Description:
Max 500

MonthlyAmount:
> 0

TotalMembers:
> 1

DurationInMonths:
> 0

StartDate:
>= Today

CollectionDay:
1–31

LateFee:
>= 0

GracePeriod:
>= 0

BisiType:
Valid enum

AuctionDay:
Required for Auction
1–31
```

------------------------------------------------------------------------

# 34. Global Exception Middleware

The API uses global exception handling.

Purpose:

-   Centralized error handling
-   Consistent API responses
-   Logging unexpected exceptions
-   Mapping exceptions to status codes

Example mapping:

``` text
ValidationException       → 400
ArgumentException         → 400
UnauthorizedAccessException → 401
KeyNotFoundException      → 404
Unhandled Exception       → 500
```

------------------------------------------------------------------------

# 35. Logging

ASP.NET Core `ILogger<T>` is used for application logging.

Recommended locations:

``` text
Global Exception Middleware
Command Handlers
Important Application Services
Controllers when meaningful
```

Controllers should not be filled with unnecessary logs.

Never log:

``` text
Passwords
Password hashes
JWT tokens
Secrets
Connection strings
```

------------------------------------------------------------------------

# 36. Mapping

Domain entities should not be directly returned by API endpoints.

Explicit mapping classes are used.

Example:

``` text
Group
  ↓
GroupMapping
  ↓
GroupResponse
```

``` text
GroupMember
  ↓
GroupMemberMapping
  ↓
GroupMemberResponse
```

Mapping keeps internal domain models separate from external API
contracts.

------------------------------------------------------------------------

# 37. GroupMember Technical Flow

Endpoint:

``` http
POST /api/GroupMember/{groupId}
```

Request:

``` json
{
  "userId": "USER-GUID"
}
```

Authentication:

``` text
JWT → AgentId
```

Backend flow:

``` text
GroupId
  ↓
AgentId from JWT
  ↓
Find Group
  ↓
Verify ownership
  ↓
Find User
  ↓
Verify User active
  ↓
Verify KYC Completed
  ↓
Check duplicate membership
  ↓
Check capacity
  ↓
Calculate PayableAmount
  ↓
Create GroupMember
  ↓
Save database
  ↓
Map response
```

------------------------------------------------------------------------

# 38. Payable Amount

The backend calculates:

``` text
PayableAmount =
Group.MonthlyAmount / Group.TotalMembers
```

Example:

``` text
MonthlyAmount = ₹100,000
TotalMembers = 10

PayableAmount = ₹10,000
```

The frontend/mobile client must not be trusted to submit this value.

------------------------------------------------------------------------

# 39. React Web Architecture

The React application should be organized by features rather than one
large components directory.

Recommended structure:

``` text
src/
├── app/
├── components/
├── features/
│   ├── auth/
│   ├── groups/
│   ├── group-members/
│   └── users/
├── layouts/
├── pages/
├── routes/
├── services/
├── hooks/
├── types/
├── utils/
└── lib/
```

------------------------------------------------------------------------

# 40. React TypeScript

TypeScript should be used for:

-   API request types
-   API response types
-   Component props
-   Form models
-   Filter models
-   Enums
-   Shared frontend models

Example:

``` ts
export interface GroupResponse {
  groupId: string;
  groupName: string;
  monthlyAmount: number;
  totalMembers: number;
  isActive: boolean;
}
```

------------------------------------------------------------------------

# 41. React API Layer

API calls should be separated from UI components.

Recommended:

``` text
features/groups/
├── api/
│   └── groupApi.ts
├── components/
├── pages/
├── hooks/
└── types/
```

Components should not contain large amounts of raw Axios configuration.

------------------------------------------------------------------------

# 42. Authentication on Web

The web client will:

``` text
Login
  ↓
Receive JWT
  ↓
Store token according to security strategy
  ↓
Attach token to API requests
  ↓
Handle 401 responses
```

Sensitive authentication storage decisions should follow the final
security architecture.

------------------------------------------------------------------------

# 43. Tailwind CSS

Tailwind CSS will be used for utility-based styling.

Use Tailwind for:

-   Spacing
-   Layout
-   Responsive design
-   Typography
-   States
-   Component composition

Avoid unnecessary custom CSS when Tailwind can express the design
cleanly.

------------------------------------------------------------------------

# 44. Bootstrap

Bootstrap will be available for:

-   Layout utilities
-   Responsive patterns
-   Existing Bootstrap components where required
-   Familiar grid/utilities

However, the project should avoid creating conflicting styling systems
for the same component.

Recommended rule:

> Use Tailwind as the primary styling system and Bootstrap selectively
> where it provides clear value or where an existing component depends
> on it.

------------------------------------------------------------------------

# 45. shadcn/ui

shadcn/ui will be used for reusable accessible interface components.

Potential components:

-   Button
-   Input
-   Select
-   Dialog
-   Dropdown
-   Table
-   Pagination
-   Calendar
-   Date Picker
-   Tabs
-   Card
-   Sheet
-   Toast
-   Alert Dialog

Components should be customized to match the BisiPro design system.

------------------------------------------------------------------------

# 46. Frontend Design System

The web application should maintain consistent:

-   Typography
-   Spacing
-   Border radius
-   Form styles
-   Buttons
-   Tables
-   Dialogs
-   Status badges
-   Empty states
-   Loading states
-   Error states

Group and member management should use reusable components rather than
duplicated UI code.

------------------------------------------------------------------------

# 47. React Native Architecture

The mobile application should follow a feature-based architecture.

Recommended:

``` text
src/
├── navigation/
├── screens/
├── features/
│   ├── auth/
│   ├── groups/
│   ├── members/
│   └── profile/
├── components/
├── services/
├── hooks/
├── types/
├── utils/
└── storage/
```

The mobile application will consume REST APIs and will not connect
directly to SQL Server.

------------------------------------------------------------------------

# 48. API Client Abstraction

Web and mobile clients should use an API abstraction layer.

Example:

``` text
Web
 └── groupApi
      ↓
   REST API

Mobile
 └── groupApi
      ↓
   REST API
```

The backend remains the single source of business truth.

------------------------------------------------------------------------

# 49. API Versioning

As the application grows, API versioning should be considered.

Potential future structure:

``` text
/api/v1/groups
/api/v1/group-members
```

Versioning should be introduced before breaking changes are released to
external clients.

------------------------------------------------------------------------

# 50. Security Requirements

The system must:

-   Require authentication for protected endpoints
-   Validate JWTs
-   Verify authorization
-   Validate ownership
-   Never trust AgentId from request payloads
-   Never trust financial calculations from clients
-   Validate all input
-   Use parameterized EF Core queries
-   Protect secrets using configuration/environment mechanisms
-   Avoid sensitive logging
-   Use HTTPS in non-development environments

------------------------------------------------------------------------

# 51. Financial Data Requirements

Financial values should use:

``` csharp
decimal
```

rather than floating-point types.

EF Core precision should be explicitly configured.

Example:

``` csharp
entity.Property(x => x.PayableAmount)
    .HasPrecision(18, 2);
```

The same principle should apply to:

-   MonthlyAmount
-   LateFee
-   Payment amounts
-   Auction-related financial values

------------------------------------------------------------------------

# 52. Date Handling

The application currently uses:

``` csharp
DateOnly
```

for date-only business concepts such as:

-   DateOfBirth
-   StartDate
-   EndDate
-   JoinedDate
-   ExitDate

Date/time values such as audit timestamps use:

``` csharp
DateTime
```

Audit timestamps should preferably use UTC.

------------------------------------------------------------------------

# 53. Cancellation Tokens

Async application methods should accept and pass:

``` csharp
CancellationToken
```

Example:

``` csharp
await _context.Groups
    .ToListAsync(cancellationToken);
```

This allows requests to be cancelled cleanly.

------------------------------------------------------------------------

# 54. Async Programming

Database and API operations must use asynchronous APIs.

Preferred:

``` csharp
await repository.GetAsync(
    cancellationToken);
```

Avoid blocking calls such as:

``` csharp
.Result
.Wait()
```

in ASP.NET Core request processing.

------------------------------------------------------------------------

# 55. API HTTP Methods

The project follows standard HTTP semantics:

``` text
GET     → Read
POST    → Create
PUT     → Update
PATCH   → Partial Update when required
DELETE  → Delete/deactivate
```

------------------------------------------------------------------------

# 56. Testing Strategy

The project should eventually include:

## Unit Tests

Test:

-   Validators
-   Command handlers
-   Query handlers
-   Business rules
-   Mapping

## Integration Tests

Test:

-   API endpoints
-   Authentication
-   Authorization
-   Database behavior
-   Repository queries

## Manual API Testing

Postman can be used during development to test:

-   Authentication
-   Group CRUD
-   Filters
-   Pagination
-   GroupMember APIs
-   Authorization scenarios

------------------------------------------------------------------------

# 57. Important Test Scenarios

## Group

``` text
Create valid group
Invalid group name
Invalid monthly amount
Invalid total members
Invalid dates
Auction without AuctionDay
Update owned group
Attempt to update another Agent's group
Delete owned group
```

## GroupMember

``` text
Add valid member
User not found
Group not found
KYC pending
KYC rejected
Duplicate member
Group full
Wrong Agent
Payable amount calculation
```

------------------------------------------------------------------------

# 58. Performance Requirements

The application should:

-   Use pagination
-   Use `AsNoTracking()` for read-only queries
-   Add indexes to frequently searched fields
-   Avoid N+1 database queries
-   Load related entities intentionally
-   Avoid returning unnecessary columns/data
-   Use async database APIs
-   Use cancellation tokens

------------------------------------------------------------------------

# 59. Suggested Database Indexes

Potential indexes include:

``` text
Groups.AgentId
Groups.IsActive
Groups.GroupName
Groups.StartDate
Groups.BisiType
GroupMember.GroupId
GroupMember.UserId
GroupMember(GroupId, UserId) UNIQUE
Users.Email
Users.PhoneNumber
Users.RoleId
```

Indexes should be finalized based on actual query patterns and database
performance.

------------------------------------------------------------------------

# 60. Configuration

Configuration should be stored outside source code where possible.

Examples:

``` text
ConnectionStrings
JwtSettings
Logging
AllowedOrigins
```

Development secrets should not be committed to source control.

------------------------------------------------------------------------

# 61. Environment Strategy

The project should support at least:

``` text
Development
Staging
Production
```

Each environment should have its own:

-   Database configuration
-   JWT configuration
-   Allowed origins
-   Logging configuration
-   External service settings

------------------------------------------------------------------------

# 62. CORS

The API must configure CORS for approved web application origins.

Production should not use:

``` text
AllowAnyOrigin
```

with credential-based authentication.

Allowed origins should be explicitly configured.

------------------------------------------------------------------------

# 63. Frontend Responsive Design

The web application must support:

-   Desktop
-   Tablet
-   Mobile browser

Responsive behavior should be implemented primarily using Tailwind
responsive utilities.

------------------------------------------------------------------------

# 64. Mobile API Reuse

React Native should reuse the same backend business rules.

Example:

``` text
Web Add Member
      ↓
POST /api/GroupMember/{groupId}

Mobile Add Member
      ↓
POST /api/GroupMember/{groupId}
```

The backend should not duplicate business rules between clients.

------------------------------------------------------------------------

# 65. Source Control

Git should be used for source control.

Recommended repository structure:

``` text
BisiPro/
├── Backend/
├── Frontend/
├── Mobile/
├── docs/
└── README.md
```

Do not commit:

``` text
.env
passwords
JWT secrets
database credentials
private certificates
node_modules
bin/
obj/
```

------------------------------------------------------------------------

# 66. Documentation

The project documentation should include:

``` text
docs/
├── BisiPro_PRD.md
├── BisiPro_TRD.md
├── API.md
├── Database.md
└── Architecture.md
```

The PRD describes **what and why**.

The TRD describes **how the system is technically built**.

------------------------------------------------------------------------

# 67. Technical Roadmap

## Phase 1 --- Backend Foundation

-   .NET 10
-   Clean Architecture
-   EF Core
-   SQL Server
-   Authentication
-   JWT
-   Password hashing
-   Common responses
-   Global exception middleware
-   FluentValidation
-   CQRS
-   Repository Pattern

## Phase 2 --- Groups

-   Group entity
-   CRUD
-   Agent ownership
-   Filtering
-   Sorting
-   Pagination
-   Mapping
-   Group details

## Phase 3 --- Group Members

-   GroupMember entity
-   Repository
-   Add member
-   KYC checks
-   Capacity
-   Duplicate prevention
-   Payable amount
-   Member details
-   Member filtering

## Phase 4 --- Web Application

-   React
-   TypeScript
-   Tailwind
-   Bootstrap
-   shadcn/ui
-   Authentication UI
-   Agent dashboard
-   Group management
-   Member management

## Phase 5 --- Mobile

-   React Native
-   Authentication
-   Agent/member workflows
-   Group management
-   Member management
-   Notifications

## Phase 6 --- Financial Operations

-   Collections
-   Payments
-   Receipts
-   Late fees
-   Payment history

## Phase 7 --- Auction

-   Auction schedules
-   Bids
-   Winners
-   Auction history
-   Calculations

## Phase 8 --- Reporting

-   Dashboards
-   Financial reports
-   Member reports
-   Agent reports
-   Export functionality

------------------------------------------------------------------------

# 68. Technical Success Criteria

The technical implementation is successful when:

1.  The API runs on .NET 10.
2.  SQL Server persists all application data.
3.  EF Core manages database access and migrations.
4.  CQRS separates commands and queries.
5.  MediatR dispatches application requests.
6.  Repository interfaces isolate Infrastructure.
7.  FluentValidation validates requests.
8.  Global exception handling provides consistent errors.
9.  JWT protects secured APIs.
10. Agent ownership is enforced server-side.
11. Group filtering and pagination work correctly.
12. GroupMember capacity and duplicate rules are enforced.
13. PayableAmount is calculated server-side.
14. React web application consumes the API.
15. React Native consumes the same API.
16. Domain entities are separated from API DTOs.
17. The system is maintainable and ready for future modules.

------------------------------------------------------------------------

# 69. Final Technical Architecture

``` text
                         ┌─────────────────────┐
                         │     Web Browser     │
                         │ React + TypeScript  │
                         │ Tailwind + Bootstrap│
                         │     shadcn/ui       │
                         └──────────┬──────────┘
                                    │
                                    │ HTTPS / REST
                                    │
                         ┌──────────▼──────────┐
                         │    React Native     │
                         │    Mobile Client    │
                         └──────────┬──────────┘
                                    │
                                    │ HTTPS / REST
                                    ▼
                    ┌──────────────────────────────┐
                    │       BisiPro.Api             │
                    │     ASP.NET Core / .NET 10   │
                    │                              │
                    │ Controllers / Auth / JWT     │
                    └──────────────┬───────────────┘
                                   │
                                   ▼
                    ┌──────────────────────────────┐
                    │     BisiPro.Application       │
                    │                              │
                    │ CQRS / MediatR              │
                    │ Commands / Queries           │
                    │ Validators / Behaviors       │
                    │ Mapping / Business Rules     │
                    └──────────────┬───────────────┘
                                   │
                         ┌─────────┴─────────┐
                         │                   │
                         ▼                   ▼
              ┌──────────────────┐  ┌──────────────────┐
              │ BisiPro.Domain   │  │ BisiPro.Contracts│
              │                  │  │                  │
              │ Entities         │  │ Requests         │
              │ Enums            │  │ Responses        │
              │ Base Classes     │  │ Pagination       │
              └──────────────────┘  └──────────────────┘
                         │
                         ▼
              ┌──────────────────────────────┐
              │ BisiPro.Infrastructure       │
              │                              │
              │ EF Core                      │
              │ Repositories                 │
              │ Authentication               │
              │ DbContext                    │
              │ Migrations                   │
              └──────────────┬───────────────┘
                             │
                             ▼
                    ┌───────────────────┐
                    │    SQL Server     │
                    │    BisiProDb      │
                    │                   │
                    │ SSMS             │
                    └───────────────────┘
```

------------------------------------------------------------------------

# 70. Technology Decision Summary

  Area                  Selected Technology
  --------------------- -------------------------
  Backend Runtime       .NET 10
  Backend Language      C#
  API                   ASP.NET Core
  Architecture          Clean Architecture
  Application Pattern   CQRS
  Mediator              MediatR
  Validation            FluentValidation
  ORM                   Entity Framework Core
  Database              Microsoft SQL Server
  DB Management         SSMS
  Authentication        JWT
  Password Security     Password Hashing
  Web                   React JS
  Web Language          TypeScript
  Primary CSS           Tailwind CSS
  Secondary UI/Layout   Bootstrap
  Component Library     shadcn/ui
  Mobile                React Native
  API Communication     REST / HTTPS
  Development Skills    skills.sh / skill files
  Source Control        Git

------------------------------------------------------------------------

# 71. Technical Guiding Principle

The BisiPro technical architecture should follow one central principle:

> **Keep the business logic centralized in the .NET backend, keep
> clients lightweight, keep data access isolated, and keep each layer
> responsible for one clear concern.**

This allows the React web application and React Native mobile
application to evolve independently while using the same secure business
logic and database.

------------------------------------------------------------------------

**End of BisiPro Technical Requirements Document**
