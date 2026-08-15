BisiPro

A modern digital platform for managing Bisi/Chit-style rotating savings groups, agents, members, KYC, collections, and future financial operations.

🚀 Project Overview

BisiPro is a full-stack application designed to digitize and simplify the management of Bisi/Chit-style savings groups.

The platform is being built to help agents manage:

Bisi/Chit groups

Group members

Member KYC information

Group capacity and membership

Monthly payable amounts

Collections and payment history

Auctions

Financial records

Reports and dashboards

BisiPro is designed as a multi-client platform with a Web Application and a Mobile Application, both consuming the same secure backend API.

🎯 Project Goal

The main goal of BisiPro is to replace manual and fragmented Bisi/Chit management processes with a centralized digital system.

The platform aims to provide:

Better group management

Accurate member records

Secure authentication and authorization

Automated business-rule validation

Reliable financial calculations

Easy member tracking

Centralized collection/payment records

Web and mobile accessibility

A scalable architecture for future financial modules

🏗️ Architecture

BisiPro follows a layered architecture inspired by Clean Architecture, combined with CQRS and the Repository Pattern.

                    BisiPro Platform
                           │
              ┌────────────┴────────────┐
              │                         │
              ▼                         ▼
        React Web App            React Native App
              │                         │
              └────────────┬────────────┘
                           │
                           ▼
                    RESTful API
                           │
                           ▼
                  ASP.NET Core / .NET 10
                           │
                    ┌──────┴──────┐
                    │             │
                    ▼             ▼
             Application       Infrastructure
                    │             │
                    └──────┬──────┘
                           ▼
                    Entity Framework
                           │
                           ▼
                       SQL Server

🛠️ Technology Stack

Backend

Technology

Purpose

.NET 10

Backend platform

C#

Programming language

ASP.NET Core

REST API

MediatR

CQRS / request handling

FluentValidation

Request validation

Entity Framework Core

ORM / data access

SQL Server

Relational database

SSMS

Database management

JWT

Authentication

Password Hashing

Secure credential storage

Web Frontend

Technology

Purpose

React JS

Web application

TypeScript

Type safety

Tailwind CSS

Primary styling

Bootstrap

Layout/utilities and selected components

shadcn/ui

Reusable accessible UI components

Mobile

Technology

Purpose

React Native

Mobile application

Development

Technology

Purpose

Git

Version control

GitHub

Source control and collaboration

skills.sh / Skill Files

Development assistance and reusable workflows

📁 Project Structure

BisiPro/
│
├── .github/
│   └── workflows/
│
├── Backend/
│   └── BisiPro/
│       ├── BisiPro.Api/
│       ├── BisiPro.Application/
│       ├── BisiPro.Contracts/
│       ├── BisiPro.Domain/
│       ├── BisiPro.Infrastructure/
│       └── BisiPro.Shared/
│
├── Database/
├── Docker/
│
├── Docs/
│   ├── BisiPro_PRD.md
│   └── BisiPro_TRD.md
│
├── Frontend/
├── .gitignore
└── README.md

🧩 Backend Architecture

BisiPro.Api

Responsible for:

Controllers

HTTP endpoints

Authentication boundary

Authorization

Route/query/body handling

Dispatching MediatR commands and queries

Returning API responses

Controllers should remain thin and should not contain substantial business logic.

BisiPro.Application

Responsible for:

Business use cases

CQRS commands

CQRS queries

Command handlers

Query handlers

FluentValidation validators

Repository interfaces

Mapping

Application-level business rules

BisiPro.Contracts

Contains API contracts such as:

Request DTOs

Response DTOs

Common API responses

Pagination responses

BisiPro.Domain

Contains the core domain model:

Entities

Enums

Base entities

Auditable entities

Domain relationships

BisiPro.Infrastructure

Responsible for:

Entity Framework Core

SQL Server

DbContext

Repository implementations

Database migrations

Authentication implementations

JWT services

Password hashing

Infrastructure dependency injection

🔐 Authentication & Authorization

BisiPro uses JWT-based authentication.

Login
  ↓
Validate Credentials
  ↓
Verify Password
  ↓
Generate JWT
  ↓
Client Receives Token
  ↓
Authorization: Bearer <Token>
  ↓
Protected API

Protected endpoints use:

[Authorize]

The authenticated Agent/User ID is obtained from JWT claims rather than trusting an Agent ID supplied by the client.

Every Agent-specific operation must verify resource ownership on the server.

👥 Core Domain Entities

The current system includes:

Role
 │
 └── User

User
 │
 └── GroupMember
          │
          └── Group

User

Stores information such as:

First Name

Last Name

Email

Date of Birth

Phone Number

Password Hash

Role

KYC Status

Nominee information

Village

Active status

Role

Defines the user's application role.

Examples:

Agent
Member
Admin

Group

Represents a Bisi/Chit savings group.

Important information includes:

Group Name

Description

Bisi Type

Monthly Amount

Total Members

Duration

Start Date

End Date

Collection Day

Auction Day

Late Fee

Grace Period

Active status

Agent ownership

GroupMember

Connects Users with Groups.

User ─────< GroupMember >───── Group

It stores membership-specific information such as:

Group ID

User ID

Payable Amount

Joined Date

Exit Date

Active status

Audit information

A unique (GroupId, UserId) constraint prevents duplicate membership.

💰 Payable Amount

BisiPro calculates a member's monthly payable amount from the group configuration.

Example:

Group Monthly Amount = ₹100,000
Total Members        = 10

Member Payable Amount = ₹100,000 / 10
                      = ₹10,000

The backend is responsible for calculating this value rather than trusting a value supplied by the client.

🪪 KYC Management

Members have a KYC status.

Current states:

Pending
Completed
Rejected

Certain group operations can require:

KYC Status = Completed

👥 Group Management

The Group module supports:

Create Group

Get Group

Get All Groups

Update Group

Delete Group

Agent ownership

Filtering

Sorting

Pagination

Mapping

Group details

Group Filtering

Supported filters include:

Group name/search

Bisi type

Active status

Start date

End date

Collection day

Auction day

Pagination includes:

PageNumber
PageSize
TotalCount
TotalPages
HasPrevious
HasNext

Sorting supports:

SortBy
SortOrder

The current Group filter design intentionally does not include minimum and maximum amount filters.

👨‍👩‍👧 Group Membership

Typical flow:

Agent
  ↓
Select Group
  ↓
Select User
  ↓
Verify Group Ownership
  ↓
Verify User
  ↓
Verify KYC
  ↓
Check Group Capacity
  ↓
Check Duplicate Membership
  ↓
Calculate Payable Amount
  ↓
Create GroupMember

🧠 CQRS

BisiPro uses CQRS (Command Query Responsibility Segregation).

Commands modify state:

CreateGroupCommand
UpdateGroupCommand
DeleteGroupCommand
CreateGroupMemberCommand

Queries retrieve data:

GetAllGroupsQuery
GetGroupByIdQuery
GetGroupMembersQuery

MediatR connects controllers to handlers.

Controller
    ↓
MediatR
    ↓
Command / Query Handler
    ↓
Repository
    ↓
Entity Framework Core
    ↓
SQL Server

🗄️ Database

BisiPro uses:

Microsoft SQL Server

Database administration is performed using:

SQL Server Management Studio (SSMS)

Entity Framework Core manages:

Database access

Relationships

Queries

Migrations

Inserts

Updates

Deletes

🔄 Entity Framework Migrations

Database schema changes are managed through EF Core migrations.

Typical commands:

Add-Migration MigrationName
Update-Database

Migrations should be committed to source control so database changes can be tracked with application code.

🧪 Testing

During development, APIs are manually tested using Postman.

Testing covers:

Authentication

Group CRUD

Group filtering

Pagination

Sorting

Group ownership

GroupMember creation

KYC validation

Capacity validation

Duplicate membership

Payable amount calculation

Authorization failures

Automated unit and integration testing will be expanded as the project grows.

🌐 Web Frontend

The web application uses:

React JS
TypeScript
Tailwind CSS
Bootstrap
shadcn/ui

The frontend communicates with the backend through REST APIs.

React
  ↓
API Client
  ↓
BisiPro REST API

The frontend does not directly communicate with SQL Server.

📱 Mobile Application

A React Native application is planned for mobile access.

The mobile application will use the same backend APIs as the web application.

React Native
      ↓
BisiPro REST API
      ↓
ASP.NET Core
      ↓
SQL Server

This keeps business rules centralized in the backend.

🛡️ Security Principles

BisiPro follows these principles:

JWT authentication

Server-side authorization

Agent ownership validation

Request validation

Secure password hashing

No direct database access from clients

Server-side financial calculations

Sensitive information excluded from logs

Secrets excluded from source control

HTTPS for deployed environments

Restricted database relationships where appropriate

📊 Future Modules

Collections & Payments

Monthly collections

Payment records

Payment history

Receipts

Late fees

Outstanding amounts

Auctions

Auction schedules

Auction participation

Bids

Winners

Auction history

Auction calculations

Notifications

Payment reminders

Due-date notifications

Auction notifications

KYC notifications

Reports

Group reports

Member reports

Collection reports

Payment reports

Agent dashboards

Financial summaries

Export functionality

Mobile Application

Agent mobile dashboard

Group management

Member management

Collections

Notifications

Member-facing features

🗺️ Development Roadmap

Phase 1
Backend Foundation
    ↓
Authentication & Authorization
    ↓
Phase 2
Group Management
    ↓
Filtering / Sorting / Pagination
    ↓
Phase 3
GroupMember Management
    ↓
KYC / Capacity / Payable Amount
    ↓
Phase 4
React Web Application
    ↓
Phase 5
React Native Mobile Application
    ↓
Phase 6
Collections & Payments
    ↓
Phase 7
Auctions
    ↓
Phase 8
Reports & Notifications

📚 Documentation

Additional project documentation is available in the Docs folder.

Docs/
├── BisiPro_PRD.md
└── BisiPro_TRD.md

PRD

The Product Requirements Document explains what BisiPro is, why it is being built, product goals, features, business requirements, and roadmap.

TRD

The Technical Requirements Document explains the technology stack, architecture, database design, security, API architecture, development standards, and technical roadmap.

💻 Getting Started

Prerequisites

Install:

.NET 10 SDK

Visual Studio / Visual Studio Code

SQL Server

SQL Server Management Studio

Node.js

npm

Git

For mobile development:

React Native development environment

Android Studio and required mobile tooling

Backend

Clone the repository:

git clone https://github.com/Phulsingh/BisiPro.git
cd BisiPro
dotnet restore
dotnet build

Configure the local database connection and required application settings using local development configuration.

Apply migrations:

Update-Database

Run the API:

dotnet run

Frontend

Move into the frontend project:

cd Frontend
npm install
npm run dev

The exact command may vary with the final frontend structure.

🔀 Git Workflow

BisiPro uses Git for source control.

Recommended workflow:

Create / update feature
        ↓
Test feature
        ↓
git status
        ↓
git add .
        ↓
git commit -m "Meaningful message"
        ↓
git push

Example:

git add .
git commit -m "Implement GroupMember creation"
git push

Example commit messages:

Add JWT authentication
Implement Group CRUD
Add Group filtering and pagination
Implement GroupMember creation
Add KYC validation
Fix GroupMember ownership validation
Add Group mapping

📌 Project Status

Current development focus:

Backend architecture

Authentication

Group management

Group filtering

Pagination

Mapping

User KYC

GroupMember management

Business-rule validation

The project is under active development and features will continue to be added incrementally.

🤝 Development Principles

BisiPro is being built with these principles:

Keep business logic on the backend

Keep controllers thin

Keep domain models independent

Separate API contracts from domain entities

Validate input before processing

Protect resources with proper authorization

Calculate financial values server-side

Use reusable UI components

Prefer maintainable code over unnecessary complexity

Track changes through Git

Document important architectural decisions

📄 License

The licensing model for BisiPro has not yet been finalized.

Until a license is explicitly added, all rights are reserved by the project owner.

👨‍💻 Project

BisiPro

A digital platform for modernizing Bisi/Chit group management.

Built with:

.NET 10
C#
ASP.NET Core
Entity Framework Core
SQL Server
React JS
TypeScript
Tailwind CSS
Bootstrap
shadcn/ui
React Native

BisiPro — Digitizing Bisi/Chi
