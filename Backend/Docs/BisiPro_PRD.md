# BisiPro --- Product Requirements Document (PRD)

**Project:** BisiPro\
**Document Type:** Product Requirements Document\
**Version:** 1.0\
**Status:** Active Development\
**Technology:** .NET 10, ASP.NET Core, EF Core, SQL Server, React,
TypeScript, Tailwind CSS\
**Architecture:** Clean Architecture + CQRS + MediatR + Repository
Pattern

------------------------------------------------------------------------

# 1. Executive Summary

BisiPro is a digital platform for managing **Bisi/Chit-style rotating
savings groups**.

The goal of BisiPro is to replace manual group-management
processes---paper records, spreadsheets, phone calls, and disconnected
payment/member tracking---with a centralized application where
authorized agents can create and manage groups, onboard members, track
KYC information, manage member participation, and maintain group-level
financial and operational information.

The platform is being designed around a secure, role-based architecture.
An Agent should only be able to access and operate on the groups that
belong to that Agent.

The system is intended to provide a strong backend foundation that can
later support a complete web application for Agents, administrators, and
members.

------------------------------------------------------------------------

# 2. Product Vision

## Vision

> Build a reliable, secure, and scalable digital platform that makes
> Bisi group management simple, transparent, and organized for Agents
> and their members.

BisiPro should make it possible for an Agent to manage the complete
lifecycle of a Bisi group from one system:

-   Create a Bisi group
-   Configure group rules
-   Add eligible members
-   Manage KYC information
-   Track member participation
-   Calculate each member's payable amount
-   View group capacity and availability
-   Update or deactivate groups
-   Maintain a clear audit trail
-   Secure all Agent-specific operations

------------------------------------------------------------------------

# 3. Problem Statement

Traditional Bisi management can involve:

-   Manual registers
-   Excel spreadsheets
-   Paper-based KYC records
-   Difficult member tracking
-   Manual calculations
-   Duplicate records
-   Lack of centralized information
-   Difficulty identifying which Agent owns a group
-   Limited access control
-   Difficulty retrieving historical information
-   Human errors in group/member calculations

BisiPro addresses these problems by providing a centralized, structured,
and secure application.

------------------------------------------------------------------------

# 4. Primary Goals

## 4.1 Group Management

Allow Agents to:

-   Create groups
-   View their groups
-   View group details
-   Edit groups
-   Delete/deactivate groups
-   Filter groups
-   Sort groups
-   Paginate large group lists

## 4.2 Member Management

Allow Agents to:

-   Add users to groups
-   View group members
-   Track member membership
-   Prevent duplicate memberships
-   Prevent adding members after group capacity is reached
-   Calculate member payable amounts automatically
-   Remove/deactivate members when required

## 4.3 User and KYC Management

Maintain user information including:

-   First Name
-   Last Name
-   Email
-   Date of Birth
-   Phone Number
-   Village
-   Nominee Name
-   Nominee Phone Number
-   KYC Status
-   Active/Inactive status
-   Role

KYC statuses:

-   Pending
-   Completed
-   Rejected

Only users with completed KYC should be eligible for group membership
according to the current business rules.

## 4.4 Security

The platform must:

-   Authenticate users
-   Use JWT-based authentication
-   Authorize protected endpoints
-   Associate groups with Agents
-   Prevent an Agent from accessing another Agent's groups
-   Validate ownership before sensitive group operations

## 4.5 Maintainability

The backend should remain:

-   Modular
-   Testable
-   Scalable
-   Easy to extend
-   Based on clear separation of responsibilities

------------------------------------------------------------------------

# 5. Target Users / Roles

## 5.1 Agent

The Agent is the primary operational user.

Agent responsibilities include:

-   Creating Bisi groups
-   Managing owned groups
-   Adding members
-   Viewing group members
-   Managing group information
-   Monitoring group capacity
-   Managing member participation

### Agent access rule

An Agent must only see and operate on groups where:

``` text
Group.AgentId == CurrentAuthenticatedAgentId
```

The Agent ID should be obtained from the authenticated JWT rather than
trusted from client input.

------------------------------------------------------------------------

## 5.2 Administrator

The system is designed to support an Administrator role for future
administrative capabilities.

Potential responsibilities:

-   User management
-   Agent management
-   System-level monitoring
-   Configuration
-   Reporting
-   Auditing

Administrative capabilities can be expanded independently from Agent
functionality.

------------------------------------------------------------------------

## 5.3 Member / User

A User represents a person who can become a member of a Bisi group.

A User may:

-   Maintain personal information
-   Complete KYC
-   Be nominated
-   Belong to one or more groups depending on business rules
-   Have a group-specific payable amount
-   Have a membership lifecycle

------------------------------------------------------------------------

# 6. Core Business Concept

A **Group** represents a Bisi savings scheme.

Example:

``` text
Group Monthly Amount = ₹100,000
Total Members        = 10

Member Payable Amount
= ₹100,000 / 10
= ₹10,000 per member per month
```

The payable amount is calculated by the backend.

The client must not be trusted to provide or modify the calculated
payable amount.

------------------------------------------------------------------------

# 7. Bisi Types

The application supports a `BisiType` enum.

The exact numeric values are controlled by the domain enum.

Examples include:

-   Normal / Fixed type
-   Premium type
-   Auction type

Auction-based groups have additional rules such as:

-   Auction Day

When `BisiType == Auction`, `AuctionDay` becomes required.

------------------------------------------------------------------------

# 8. Group Requirements

A Group contains information such as:

  Field              Purpose
  ------------------ --------------------------------
  Id                 Unique group identifier
  GroupName          Name of the group
  Description        Group description
  BisiType           Type of Bisi
  MonthlyAmount      Total monthly group amount
  TotalMembers       Maximum member capacity
  DurationInMonths   Group duration
  StartDate          Start date
  EndDate            End date
  CollectionDay      Monthly collection day
  AuctionDay         Auction day for auction groups
  LateFee            Late payment fee
  GracePeriod        Grace period
  IsActive           Active/deactivated status
  AgentId            Owner of the group

------------------------------------------------------------------------

# 9. Group Validation Rules

Current validation rules include:

### Group Name

-   Required
-   Maximum length: 100 characters

### Description

-   Maximum length: 500 characters

### Monthly Amount

-   Must be greater than zero

### Total Members

-   Must be greater than 1

### Duration

-   Must be greater than zero

### Start Date

-   Cannot be in the past

### Collection Day

-   Must be between 1 and 31

### Late Fee

-   Must be greater than or equal to zero

### Grace Period

-   Must be greater than or equal to zero

### Bisi Type

-   Must be a valid enum value

### Auction

If the group is an Auction Bisi:

-   Auction Day is required
-   Auction Day must be between 1 and 31

------------------------------------------------------------------------

# 10. Group Filtering

The Group listing API supports advanced filtering.

Current design includes:

-   Search by Group Name
-   Bisi Type
-   Active/Inactive status
-   Start Date
-   End Date
-   Collection Day
-   Auction Day
-   Sort By
-   Sort Order
-   Pagination

The current design intentionally does **not** include:

-   Minimum Amount
-   Maximum Amount

------------------------------------------------------------------------

# 11. Sorting

Sorting controls how returned groups are ordered.

Example:

``` text
Sort By: GroupName
Sort Order: Ascending
```

returns groups alphabetically.

Example:

``` text
Sort By: StartDate
Sort Order: Descending
```

returns the newest start dates first.

Typical sort options can include:

-   GroupName
-   StartDate
-   EndDate
-   MonthlyAmount
-   TotalMembers
-   CreatedAt

------------------------------------------------------------------------

# 12. Pagination

Large datasets should not be returned in a single response.

The application uses a paged response model:

``` text
PageNumber
PageSize
TotalCount
TotalPages
HasPrevious
HasNext
Data
```

Example:

``` text
PageNumber = 1
PageSize   = 10
TotalCount = 52
TotalPages = 6
HasPrevious = false
HasNext = true
```

Pagination uses:

``` text
Skip((PageNumber - 1) * PageSize)
Take(PageSize)
```

------------------------------------------------------------------------

# 13. User Entity

The User entity contains:

``` text
Id
FirstName
LastName
Email
DateOfBirth
PhoneNumber
PasswordHash
IsActive
RoleId
KycStatus
NomineeName
NomineePhoneNumber
Village
```

The User also has a Role relationship.

------------------------------------------------------------------------

# 14. KYC

KYC is represented by an enum.

Current statuses:

``` text
Pending
Completed
Rejected
```

For group membership:

``` text
Pending  → Cannot join
Completed → Eligible
Rejected → Cannot join
```

KYC enforcement is treated as a business rule in the application layer.

------------------------------------------------------------------------

# 15. Nominee Information

A User may have:

-   Nominee Name
-   Nominee Phone Number

Nominee information is stored against the User because it belongs to the
person's identity/profile rather than one particular group membership.

------------------------------------------------------------------------

# 16. Village

Village is stored as part of the User profile.

This allows the system to associate the member with their
village/location information without duplicating it for every group
membership.

------------------------------------------------------------------------

# 17. GroupMember Entity

`GroupMember` represents the relationship between a User and a Group.

This is a key entity in the BisiPro domain.

It contains:

``` text
Id
GroupId
UserId
PayableAmount
JoinedDate
ExitDate
IsActive
CreatedAt
CreatedBy
UpdatedAt
UpdatedBy
```

Relationships:

``` text
Group 1 ──────── N GroupMember N ──────── 1 User
```

A Group can have many GroupMembers.

A User can have membership records across groups according to the
application's business rules.

------------------------------------------------------------------------

# 18. Group Capacity

The Group's `TotalMembers` represents the maximum number of members
allowed.

Example:

``` text
TotalMembers = 10
CurrentMembers = 10
```

The group is full.

A new member must not be added.

The Handler should enforce:

``` text
CurrentActiveMembers < Group.TotalMembers
```

before creating a new membership.

------------------------------------------------------------------------

# 19. Payable Amount Calculation

The member payable amount is calculated by the backend:

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

This value is stored in `GroupMember`.

This is important because the payable amount is **membership-specific**
and can be retained as part of the membership record.

------------------------------------------------------------------------

# 20. Membership Rules

When adding a member, the application should validate:

1.  Group exists
2.  Group belongs to the authenticated Agent
3.  User exists
4.  User is active
5.  KYC is completed
6.  User is not already an active member of the same group
7.  Group has available capacity
8.  Payable amount can be calculated
9.  GroupMember is created successfully

------------------------------------------------------------------------

# 21. Create GroupMember Flow

Current planned flow:

``` text
POST /api/GroupMember/{groupId}

JWT
  ↓
AgentId
  ↓
Controller
  ↓
CreateGroupMemberCommand
  ↓
FluentValidation
  ↓
CreateGroupMemberCommandHandler
  ↓
Get Group
  ↓
Verify Agent owns Group
  ↓
Get User
  ↓
Check KYC
  ↓
Check duplicate membership
  ↓
Check group capacity
  ↓
Calculate PayableAmount
  ↓
Create GroupMember
  ↓
Repository
  ↓
Database
  ↓
GroupMemberResponse
```

------------------------------------------------------------------------

# 22. Current Create GroupMember API

### Endpoint

``` http
POST /api/GroupMember/{groupId}
```

### Authentication

``` text
Bearer JWT
```

### Request Body

``` json
{
  "userId": "USER-GUID"
}
```

The request should not include:

``` text
AgentId
PayableAmount
JoinedDate
IsActive
```

These are controlled by the backend.

------------------------------------------------------------------------

# 23. Group Details API

The system also needs to provide a Group Details endpoint.

Conceptually:

``` http
GET /api/Group/{groupId}/details
```

The API should return:

-   Group details
-   Current active member count
-   Available member slots
-   Group members
-   Member user details
-   Member payable amounts
-   Membership dates
-   Active status

The Agent ownership rule must still be applied.

------------------------------------------------------------------------

# 24. Group CRUD

## Create

Agent creates a group.

``` text
POST /api/Group
```

## Read

Agent retrieves only owned groups.

``` text
GET /api/Group
```

Filtering, sorting, and pagination are supported.

## Read One

Retrieve a specific owned group.

``` text
GET /api/Group/{id}
```

## Update

Agent can update an owned group.

``` text
PUT /api/Group/{id}
```

## Delete

Agent can delete/deactivate an owned group according to the
application's deletion strategy.

``` text
DELETE /api/Group/{id}
```

------------------------------------------------------------------------

# 25. Agent Ownership Security

This is one of the most important rules in BisiPro.

Suppose:

``` text
Agent A → Group A
Agent B → Group B
```

Agent A must not be able to access Group B by changing the URL.

Therefore, sensitive queries and commands should use:

``` text
AgentId from JWT
+
GroupId from route
```

and verify:

``` text
Group.AgentId == AgentId
```

The `AgentId` must never be trusted from a normal request body.

------------------------------------------------------------------------

# 26. Authentication

BisiPro uses JWT-based authentication.

The authentication system includes:

-   Login
-   Registration
-   Password hashing
-   JWT token generation
-   Protected API endpoints

JWT identity is used to determine the currently authenticated
user/Agent.

------------------------------------------------------------------------

# 27. Password Security

Passwords should never be stored directly.

The application uses a password hashing service.

Conceptually:

``` text
Plain Password
      ↓
PasswordHasher
      ↓
PasswordHash
      ↓
Database
```

During authentication:

``` text
Password
   ↓
Verify against PasswordHash
   ↓
Success / Failure
```

------------------------------------------------------------------------

# 28. Authorization

Protected endpoints use:

``` csharp
[Authorize]
```

Authorization is especially important for:

-   Group CRUD
-   Group details
-   Group member management
-   Agent-owned resources

------------------------------------------------------------------------

# 29. Validation Architecture

BisiPro uses **FluentValidation**.

Validators are responsible for input-level validation.

Example:

``` text
GroupName required
MonthlyAmount > 0
TotalMembers > 1
UserId required
GroupId required
```

Business rules belong in handlers/services.

Examples:

``` text
Group exists?
Agent owns group?
User exists?
KYC completed?
Group full?
Duplicate membership?
```

------------------------------------------------------------------------

# 30. Validation Pipeline

The application uses a validation behavior in the CQRS/MediatR pipeline.

Conceptually:

``` text
HTTP Request
    ↓
Controller
    ↓
MediatR
    ↓
ValidationBehavior
    ↓
FluentValidator
    ↓
Handler
```

This prevents every Controller from manually calling validators.

------------------------------------------------------------------------

# 31. Global Exception Handling

BisiPro uses a global exception middleware.

Its purpose is to provide consistent API error responses.

It handles common exceptions such as:

``` text
ValidationException
UnauthorizedAccessException
KeyNotFoundException
ArgumentException
Unhandled Exception
```

Typical mappings:

``` text
Validation → 400
Unauthorized → 401
Not Found → 404
Argument Error → 400
Unexpected Error → 500
```

This keeps Controllers cleaner.

------------------------------------------------------------------------

# 32. API Response Architecture

The application uses common response contracts.

### ApiResponse

``` text
IsSuccess
Data
Error
Errors
```

### PagedResponse

``` text
PageNumber
PageSize
TotalCount
TotalPages
HasPrevious
HasNext
Data
IsSuccess
```

This gives APIs a consistent response structure.

------------------------------------------------------------------------

# 33. Mapping Architecture

The project uses explicit mapping classes to convert Domain entities
into API response DTOs.

Example:

``` text
Group
  ↓
GroupMapping
  ↓
GroupResponse
```

and:

``` text
GroupMember
  ↓
GroupMemberMapping
  ↓
GroupMemberResponse
```

Mapping prevents Domain entities from being returned directly from APIs.

Benefits:

-   Separation of concerns
-   Cleaner API contracts
-   Prevents accidental exposure of internal properties
-   Easier future DTO changes
-   Cleaner handlers

------------------------------------------------------------------------

# 34. Architecture

BisiPro follows a layered Clean Architecture approach.

Current solution structure:

``` text
BisiPro
│
├── BisiPro.Api
│
├── BisiPro.Application
│   ├── Features
│   ├── Behaviors
│   ├── Interfaces
│   └── Mappings
│
├── BisiPro.Contracts
│   ├── Common
│   └── DTOs
│
├── BisiPro.Domain
│   ├── Entities
│   ├── Enums
│   └── Base
│
├── BisiPro.Infrastructure
│   ├── Persistence
│   ├── Repositories
│   ├── Authentication
│   └── DependencyInjection
│
└── BisiPro.Shared
```

------------------------------------------------------------------------

# 35. Layer Responsibilities

## API

Responsible for:

-   HTTP requests
-   Controllers
-   Authentication/authorization boundary
-   Extracting JWT identity
-   Sending commands/queries

Controllers should remain thin.

------------------------------------------------------------------------

## Application

Responsible for:

-   Business logic
-   Commands
-   Queries
-   Handlers
-   Validators
-   MediatR
-   Repository interfaces
-   Mapping

This is the main application/business layer.

------------------------------------------------------------------------

## Domain

Responsible for:

-   Entities
-   Enums
-   Base entities
-   Core domain concepts

The Domain layer should not depend on Infrastructure.

------------------------------------------------------------------------

## Infrastructure

Responsible for:

-   EF Core
-   SQL Server
-   DbContext
-   Repository implementations
-   Authentication implementation
-   Password hashing implementation
-   JWT implementation

------------------------------------------------------------------------

## Contracts

Responsible for:

-   Request DTOs
-   Response DTOs
-   Common API response models
-   Pagination contracts

------------------------------------------------------------------------

# 36. CQRS

BisiPro uses CQRS.

## Commands

Commands change data.

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
```

The separation makes the application easier to scale and maintain.

------------------------------------------------------------------------

# 37. MediatR

MediatR connects Controllers with Application commands and queries.

Instead of:

``` text
Controller → Repository
```

the project uses:

``` text
Controller
    ↓
MediatR
    ↓
Command / Query Handler
    ↓
Repository
```

This keeps HTTP concerns separate from business logic.

------------------------------------------------------------------------

# 38. Repository Pattern

BisiPro uses the Repository Pattern.

Application defines interfaces:

``` text
IGroupRepository
IUserRepository
IRoleRepository
IGroupMemberRepository
```

Infrastructure implements them:

``` text
GroupRepository
UserRepository
RoleRepository
GroupMemberRepository
```

This keeps database implementation details outside the Application
layer.

------------------------------------------------------------------------

# 39. EF Core

Entity Framework Core is used for database access.

The application uses:

``` text
ApplicationDbContext
```

with entities such as:

``` text
Users
Roles
Groups
GroupMembers
```

The database is SQL Server.

------------------------------------------------------------------------

# 40. Entity Relationships

## User → Role

``` text
Role 1 ───── N Users
```

## Group → Agent

``` text
Agent/User 1 ───── N Groups
```

## Group → GroupMember

``` text
Group 1 ───── N GroupMembers
```

## User → GroupMember

``` text
User 1 ───── N GroupMemberships
```

Therefore:

``` text
Users
  │
  ├── Agent → Groups
  │              │
  │              └── GroupMembers
  │                       │
  └───────────────────────┘
```

------------------------------------------------------------------------

# 41. Database Constraints

The GroupMember relationship uses a unique composite index on:

``` text
GroupId + UserId
```

This prevents duplicate membership records for the same User and Group.

Foreign keys connect:

``` text
GroupMember.GroupId → Groups.Id
GroupMember.UserId  → Users.Id
```

Delete behavior is restricted to protect relationship integrity.

------------------------------------------------------------------------

# 42. Auditing

Entities use audit fields such as:

``` text
CreatedAt
CreatedBy
UpdatedAt
UpdatedBy
```

This provides the foundation for tracking when and by whom records were
created or updated.

------------------------------------------------------------------------

# 43. Logging

The application uses `ILogger` for operational logging.

Logging should be used for meaningful events such as:

-   Request processing
-   Important business operations
-   Authorization failures
-   Warnings
-   Unexpected exceptions

Sensitive data must not be logged.

Examples of information that should not be logged:

-   Passwords
-   Password hashes
-   JWT tokens
-   Other sensitive credentials

Global exception middleware is the main place for logging unexpected
unhandled exceptions.

------------------------------------------------------------------------

# 44. API Design Principles

BisiPro APIs should follow:

-   REST-style HTTP methods
-   Clear resource-oriented routes
-   JWT authentication
-   DTO-based requests/responses
-   Consistent response contracts
-   Pagination for collection endpoints
-   Validation
-   Authorization
-   Meaningful HTTP status codes

------------------------------------------------------------------------

# 45. Error Handling

The application should return consistent errors.

Examples:

### 400 Bad Request

Invalid input or business argument.

### 401 Unauthorized

No valid authentication.

### 403 Forbidden

Authenticated but not permitted to perform the operation.

### 404 Not Found

Requested resource does not exist.

### 500 Internal Server Error

Unexpected server failure.

------------------------------------------------------------------------

# 46. Current Development Status

The following areas have been implemented or actively developed:

## Completed / In Progress

### Authentication

-   JWT token service
-   Password hashing service
-   Registration flow
-   Login flow
-   Authorization using `[Authorize]`

### Group

-   Group entity
-   Group CRUD
-   Agent ownership
-   Group validation
-   Group filtering
-   Sorting
-   Pagination
-   Group mapping
-   Group details design

### User

-   User entity
-   Role relationship
-   KYC status
-   Nominee information
-   Village

### GroupMember

-   GroupMember entity
-   EF Core relationship
-   Database migration
-   GroupMember repository
-   Create GroupMember command
-   Create GroupMember handler
-   Create GroupMember validator
-   GroupMember mapping
-   Create GroupMember controller
-   Group capacity validation
-   KYC validation
-   Duplicate membership validation
-   Payable amount calculation

### Infrastructure

-   ApplicationDbContext
-   SQL Server
-   EF Core migrations
-   Repository implementations
-   Dependency injection

### API Infrastructure

-   Global exception middleware
-   Validation behavior
-   Common API responses
-   Paged responses
-   Logging

------------------------------------------------------------------------

# 47. Current GroupMember API Flow

The current Add Member API is:

``` http
POST /api/GroupMember/{groupId}
```

Example:

``` http
POST https://localhost:7081/api/GroupMember/{groupId}
```

Request:

``` json
{
  "userId": "USER-GUID"
}
```

Authentication:

``` text
Authorization: Bearer <JWT>
```

The backend obtains:

``` text
GroupId → URL
AgentId → JWT
UserId → Request Body
```

The backend calculates:

``` text
PayableAmount
JoinedDate
IsActive
GroupMember Id
Audit information
```

------------------------------------------------------------------------

# 48. Planned GroupMember APIs

The GroupMember module should eventually support:

## Add Member

``` http
POST /api/GroupMember/{groupId}
```

## Get Group Members

``` http
GET /api/GroupMember/group/{groupId}
```

## Get Member Details

``` http
GET /api/GroupMember/{memberId}
```

## Remove / Exit Member

``` http
DELETE /api/GroupMember/{memberId}
```

or an appropriate membership-exit endpoint depending on final business
requirements.

## Update Membership

``` http
PUT /api/GroupMember/{memberId}
```

when business requirements require editable membership data.

## Filter Members

Support:

-   Search
-   KYC status
-   Active status
-   Village
-   Joined date
-   Sorting
-   Pagination

------------------------------------------------------------------------

# 49. Future Financial Module

The current GroupMember foundation is designed to support a future
payment/collection module.

Future concepts may include:

-   Monthly collections
-   Payment records
-   Payment status
-   Due dates
-   Late fees
-   Grace periods
-   Payment history
-   Receipts
-   Collection tracking

The GroupMember `PayableAmount` provides the foundation for determining
each member's expected monthly contribution.

------------------------------------------------------------------------

# 50. Future Auction Module

For Auction Bisi groups, a dedicated auction workflow can later be
introduced.

Potential functionality:

-   Auction scheduling
-   Auction participants
-   Bids
-   Winning member
-   Auction amount
-   Auction history
-   Distribution calculations

The current `BisiType` and `AuctionDay` fields provide the foundation
for this future module.

------------------------------------------------------------------------

# 51. Future Reporting

Potential reports:

-   Agent group summary
-   Active groups
-   Completed groups
-   Member count
-   Group capacity
-   Collection summary
-   Outstanding payments
-   KYC status summary
-   Member participation history
-   Group financial summary

------------------------------------------------------------------------

# 52. Non-Functional Requirements

## Security

-   JWT authentication
-   Authorization
-   Password hashing
-   Agent ownership checks
-   No sensitive data in logs
-   Server-side business rule enforcement

## Performance

-   AsNoTracking for read-only queries where appropriate
-   Pagination for large collections
-   Database indexes for frequently queried fields
-   Avoid unnecessary entity loading

## Reliability

-   Global exception handling
-   Validation
-   Database constraints
-   Transactional operations where required

## Maintainability

-   Clean Architecture
-   CQRS
-   Repository Pattern
-   DTOs
-   Mapping
-   Modular feature folders

## Scalability

The architecture should allow additional modules to be added without
significantly changing existing modules.

------------------------------------------------------------------------

# 53. Suggested Future Modules

The platform can grow into modules such as:

``` text
Authentication
Users
Agents
Groups
GroupMembers
KYC
Collections
Payments
Auctions
Nominees
Notifications
Reports
Audit
Administration
```

------------------------------------------------------------------------

# 54. High-Level System Flow

``` text
                    ┌──────────────────────┐
                    │      React Web App   │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │    BisiPro.Api       │
                    │    Controllers       │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │       MediatR        │
                    │  Commands / Queries  │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │ BisiPro.Application  │
                    │ Business Logic       │
                    │ Validators / Mapping │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │ BisiPro.Infrastructure│
                    │ Repositories / EF    │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │      SQL Server      │
                    │      BisiProDb       │
                    └──────────────────────┘
```

------------------------------------------------------------------------

# 55. Example Agent Journey

``` text
Agent Login
    ↓
JWT Token
    ↓
Agent Dashboard
    ↓
Create Bisi Group
    ↓
Configure:
    - Monthly Amount
    - Total Members
    - Duration
    - Collection Day
    - Bisi Type
    ↓
Group Created
    ↓
Search / Filter Groups
    ↓
Open Group Details
    ↓
Add Users
    ↓
KYC Verification
    ↓
Capacity Check
    ↓
Payable Amount Calculation
    ↓
GroupMember Created
    ↓
Manage Members
    ↓
Future:
Collections / Payments / Auctions / Reports
```

------------------------------------------------------------------------

# 56. Example Group Lifecycle

``` text
Draft / Created
      ↓
Active
      ↓
Members Added
      ↓
Membership Full
      ↓
Collections
      ↓
Auction / Distribution (if applicable)
      ↓
Group Completed
      ↓
Archived
```

The exact status model can be expanded later if the business requires an
explicit GroupStatus enum.

------------------------------------------------------------------------

# 57. Product Success Criteria

BisiPro will be considered successful when an Agent can securely
complete the core workflow without manual database intervention:

1.  Login
2.  Create a group
3.  View only owned groups
4.  Search/filter/sort/paginate groups
5.  Open group details
6.  Add eligible users
7.  Prevent invalid memberships
8.  Automatically calculate member payable amount
9.  View group members
10. Maintain reliable database records
11. Receive consistent API errors
12. Operate securely through JWT authorization

------------------------------------------------------------------------

# 58. Key Design Principles

The project follows these principles:

### 1. Backend is the source of truth

Important values must be calculated and validated on the server.

### 2. Security before convenience

Agent ownership must be verified for protected group operations.

### 3. Thin Controllers

Controllers should handle HTTP concerns and delegate application logic
to MediatR.

### 4. Business Logic in Application Layer

Commands and handlers contain business rules.

### 5. Validation at the Pipeline

FluentValidation provides reusable request validation.

### 6. Domain entities are not API contracts

DTOs and mappings are used for external API responses.

### 7. Database integrity matters

Foreign keys, unique indexes, and constraints should prevent invalid
states.

### 8. Build incrementally

Each module should be developed and tested independently before
expanding into the next module.

------------------------------------------------------------------------

# 59. Current Priority Roadmap

## Phase 1 --- Foundation

-   Architecture
-   Authentication
-   JWT
-   Password hashing
-   User
-   Role
-   Database
-   Common responses
-   Global exception handling
-   Validation pipeline

**Status: Completed / established**

## Phase 2 --- Groups

-   Group CRUD
-   Agent ownership
-   Filtering
-   Sorting
-   Pagination
-   Mapping
-   Group details

**Status: Implemented / actively extended**

## Phase 3 --- Group Members

-   GroupMember entity
-   Repository
-   Add member
-   KYC checks
-   Capacity checks
-   Duplicate checks
-   Payable amount
-   Member response mapping
-   Group member details

**Status: Active development**

## Phase 4 --- Collections

-   Monthly payment records
-   Due dates
-   Payment status
-   Late fees
-   Grace periods
-   Collection history

**Status: Planned**

## Phase 5 --- Auction

-   Auction scheduling
-   Bids
-   Winner
-   Auction history
-   Financial calculations

**Status: Planned**

## Phase 6 --- Reporting

-   Dashboards
-   Group reports
-   Member reports
-   Collection reports
-   Agent reports

**Status: Planned**

## Phase 7 --- Notifications

-   Payment reminders
-   Due notifications
-   Auction notifications
-   Membership notifications

**Status: Planned**

------------------------------------------------------------------------

# 60. Final Product Goal

The ultimate goal of BisiPro is to become a **complete digital Bisi
management platform** where Agents can manage groups and members
securely and where future modules can handle the complete operational
lifecycle of a Bisi.

At its core:

``` text
                 BisiPro
                    │
        ┌───────────┼───────────┐
        │           │           │
     Agents       Groups      Users
                    │
                    ▼
              GroupMembers
                    │
          ┌─────────┼─────────┐
          │         │         │
       KYC      Payments    Auctions
          │         │         │
          └─────────┼─────────┘
                    │
                    ▼
                Reporting
```

The immediate objective is to establish a secure, clean, and scalable
backend foundation. Once the core Group and GroupMember workflows are
stable, the platform can expand into collections, payments, auctions,
notifications, and reporting without changing the fundamental
architecture.

------------------------------------------------------------------------

# Appendix A --- Current Core Entities

## User

``` text
User
├── Id
├── FirstName
├── LastName
├── Email
├── DateOfBirth
├── PhoneNumber
├── PasswordHash
├── IsActive
├── RoleId
├── KycStatus
├── NomineeName
├── NomineePhoneNumber
├── Village
└── Audit Fields
```

## Role

``` text
Role
├── Id
├── Name
├── Description
├── IsActive
└── Users
```

## Group

``` text
Group
├── Id
├── GroupName
├── Description
├── BisiType
├── MonthlyAmount
├── TotalMembers
├── DurationInMonths
├── StartDate
├── EndDate
├── CollectionDay
├── AuctionDay
├── LateFee
├── GracePeriod
├── IsActive
├── AgentId
├── Members
└── Audit Fields
```

## GroupMember

``` text
GroupMember
├── Id
├── GroupId
├── UserId
├── PayableAmount
├── JoinedDate
├── ExitDate
├── IsActive
└── Audit Fields
```

------------------------------------------------------------------------

# Appendix B --- Core Business Rules Summary

``` text
1. Only authenticated users can access protected APIs.

2. Agents can access only their own Groups.

3. AgentId comes from JWT.

4. GroupId comes from the route when operating on a specific Group.

5. UserId comes from the request when adding a member.

6. PayableAmount is calculated by the backend.

7. PayableAmount =
   Group.MonthlyAmount / Group.TotalMembers.

8. A group cannot exceed TotalMembers.

9. A User cannot be duplicated within the same Group.

10. KYC must be Completed before membership.

11. Validation handles input validity.

12. Handlers handle business rules.

13. Domain entities are not directly exposed as API contracts.

14. Mapping converts Domain entities to DTOs.

15. Pagination must be used for large collection endpoints.

16. Sensitive credentials must never be logged.
```

------------------------------------------------------------------------

# Appendix C --- Development Philosophy

BisiPro is being developed as a real-world production-style application
rather than as a simple CRUD demo.

The architecture intentionally separates:

``` text
HTTP
  ↓
Application
  ↓
Domain
  ↓
Infrastructure
```

This allows the project to evolve from a basic Group Management system
into a complete Bisi management platform while keeping the codebase
organized and maintainable.

------------------------------------------------------------------------

**End of Document**
