# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this project is

OCSBBS is a multi-tenant web platform for the Outer Continental Shelf BBS. It consists of a .NET 10 Web API backend and three separate React frontends managed as an npm workspace.

## Backend commands

```powershell
# Run the API (http://localhost:5015 or https://localhost:7132)
dotnet run --project API

# Add a migration (Data project holds the DbContext; API is the startup project)
dotnet ef migrations add <MigrationName> --project Data --startup-project API

# Apply pending migrations
dotnet ef database update --project Data --startup-project API
```

## Frontend commands

All frontend commands run from the `clients/` directory:

```powershell
# Install all workspace packages
cd clients && npm install

# Run a specific client
cd clients/dashboard && npm run dev   # port 5174 (admin dashboard)
cd clients/app && npm run dev         # port 5173 (subscriber reports app)

# Lint
npm run lint
```

Each client reads `VITE_API_URL` from its local `.env` file (set to `https://localhost:7132/api` for development).

## Solution structure

```
OCSBBS.slnx         ← solution file (no Dashboard/Reports csproj—they're legacy stubs)
API/                ← ASP.NET Core Web API (entry point, references Auth/Core/Data/Models)
Auth/               ← JWT token service, email service, login request/response DTOs
Core/               ← Interfaces and DTOs only — no implementations, no EF dependency
Data/               ← AppDbContext, EF Core migrations, service implementations, DbSeeder
Models/             ← EF entity classes (BaseEntity, Identity, Cms, Reports)
Infrastructure/     ← Configuration POCOs (EmailSettings, PasswordReset)
clients/
  shared/           ← npm workspace package (@shared/core): axios client, types, AuthContext
  dashboard/        ← Admin SPA (MUI + React Query + React Router)
  app/              ← Subscriber reports SPA
  fa/               ← Financial Assurance SPA (early stage)
```

## Architecture

The backend follows a strict layering: **Models → Core → Data → API**.

- **Models** contains plain entity classes. `BaseEntity` provides `int Id`. Identity entities (`ApplicationUser`, `ApplicationRole`) extend ASP.NET Identity with `int` as the key type.
- **Core** defines `ICmsService<TDto, TCreateDto, TUpdateDto>` and domain-specific sub-interfaces, plus all DTOs. Nothing here touches EF.
- **Data** implements every service interface directly against `AppDbContext` (no repository abstraction layer). Services return DTOs, not entities.
- **API** wires up DI in `Program.cs` and hosts controllers.

### Generic CMS controller

`CmsControllerBase<TDto, TCreateDto, TUpdateDto, TService>` in `API/Controllers/Base/` provides the five standard CRUD actions (GetAll with pagination+search, GetById, Create, Update, Delete). Concrete controllers are typically one-liners:

```csharp
[Route("api/[controller]")]
public class AdsController : CmsControllerBase<AdDto, CreateAdDto, UpdateAdDto, IAdService>
{
    public AdsController(IAdService service) : base(service) { }
}
```

`GetAll` and `GetById` are unauthenticated; Create/Update/Delete require `[Authorize(Roles = "Admin,Employee")]`.

### Auth

Three separate login endpoints gate access to each client:

| Endpoint | Allowed roles |
|---|---|
| `POST /api/auth/login` | Any non-Inactive role |
| `POST /api/auth/dashboard/login` | Admin, Employee |
| `POST /api/auth/app/login` | OCSBBS, Admin, Employee |

JWT tokens are stored in `localStorage` and attached via an axios request interceptor in `clients/shared/src/api/client.ts`. A 401 response interceptor clears the token and redirects to `/login`.

### Roles

Seeded by `DbSeeder`: `OCSBBS`, `BP`, `NRF`, `LFD`, `LawFirm`, `FA`, `Employee`, `Admin`, `Inactive`.

### File uploads

`POST /api/file/upload?subfolder=<name>` (requires auth) saves files to `API/wwwroot/uploads/{subfolder}/` and returns an absolute URL. Allowed subfolders: `ads`, `clients`. Allowed extensions: jpg, jpeg, png, gif, webp. Files are served as static content via `UseStaticFiles()`.

### Pagination

All `GetAll` endpoints return `PagedResult<T>` with `Items`, `TotalCount`, `Page`, `PageSize`, and computed `TotalPages`.

### Frontend shared package

`clients/shared` is the `@shared/core` npm workspace package. All three client apps import types and the axios client from it. The `shared/src/api/client.ts` axios instance uses `VITE_API_URL` as `baseURL`.

The `dashboard` app manages its own `AuthContext` (in `src/contexts/`) rather than using the one from shared, because it points to the dashboard-specific login endpoint.

## Database

SQL Server. Connection string in `API/appsettings.json` → `DefaultConnection`. The `AppDbContext` renames all ASP.NET Identity tables (e.g. `AspNetUsers` → `Users`).
