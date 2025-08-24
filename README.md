# Multi-Organization Contacts and Notes Application

A production-style Laravel + Inertia/React TypeScript application for managing contacts and notes across multiple organizations with strict data scoping and role-based access control.

## Tech Stack

- **Backend**: PHP 8.2, Laravel 12
- **Frontend**: React 19 + TypeScript, Inertia.js
- **Styling**: Tailwind CSS (black & white only), shadcn/ui components
- **Database**: SQLite (default)
- **Auth**: Laravel Breeze (Inertia + TS)
- **Authorization**: spatie/laravel-permission
- **Testing**: PHPUnit
- **Formatter**: Laravel Pint

## Setup Instructions

### Prerequisites
- PHP 8.2+
- Composer 2.x
- Node 20.x
- SQLite (included with PHP)

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd multi-org-app
   ```

2. **Install PHP dependencies**
   ```bash
   composer install
   ```

3. **Install Node dependencies**
   ```bash
   npm install
   ```

4. **Environment setup**
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

5. **Database setup**
   ```bash
   php artisan migrate --seed
   ```

6. **Storage setup**
   ```bash
   php artisan storage:link
   ```

7. **Start the application**
   ```bash
   # Terminal 1: Start Laravel server
   php artisan serve
   
   # Terminal 2: Start Vite dev server
   npm run dev
   ```

8. **Access the application**
   - Frontend: http://localhost:8000
   - Health check: http://localhost:8000/healthz

## Login Credentials

### Default Users (created by seeder)
- **Admin**: `admin@example.com` / `password`
## Features

### Authentication
- User registration, login, and logout via Laravel Breeze
- Session-based authentication with Inertia.js

### Organizations
- Create and manage multiple organizations
- Organization switcher with session persistence
- Strict data scoping per organization

### Contacts Management
- Full CRUD operations for contacts
- Avatar upload and storage
- Email uniqueness validation (case-insensitive per organization)
- Contact duplication (copies all data except email)
- Search functionality (name and email)

### Notes System
- Add, edit, and delete notes for contacts
- User attribution for all notes
- Role-based permissions (Members can manage their own notes)

### Custom Fields
- Up to 5 key-value pairs per contact
- Dynamic addition and removal
- Organization-scoped data

### Duplicate Protection
- Automatic detection of duplicate emails
- HTTP 422 response with specific payload
- UI redirection to existing contact
- Comprehensive logging

## API Endpoints

### Health Check
- `GET /healthz` - Returns `{ "ok": true }`

### Organizations
- `GET /organizations` - List user's organizations
- `POST /organizations` - Create new organization
- `POST /organizations/switch` - Switch current organization

### Contacts
- `GET /contacts` - List contacts (current org only)
- `POST /contacts` - Create new contact
- `GET /contacts/{id}` - View contact details
- `PATCH /contacts/{id}` - Update contact
- `DELETE /contacts/{id}` - Delete contact
- `POST /contacts/{id}/duplicate` - Duplicate contact

### Notes
- `POST /contacts/{id}/notes` - Add note
- `PATCH /contacts/{id}/notes/{note}` - Update note
- `DELETE /contacts/{id}/notes/{note}` - Delete note

### Custom Fields
- `POST /contacts/{id}/meta` - Add custom field
- `PATCH /contacts/{id}/meta/{meta}` - Update custom field
- `DELETE /contacts/{id}/meta/{meta}` - Delete custom field

## Testing

Run the test suite with:
```bash
php artisan test
```

Required tests:
- Cross-organization isolation (Org A cannot access Org B's data)
- Duplicate email blocking with exact 422 payload

## Code Quality

- Formatted with Laravel Pint
- Small, focused controllers
- Form Request validation
- Policy-based authorization
- Clean React TypeScript components
- shadcn/ui components for consistent UI

## Architecture Highlights

- **BelongsToOrganization trait** for automatic scoping
- **CurrentOrganization service** for session management
- **SetCurrentOrganization middleware** for request scoping
- **Spatie Permission** for role-based access control
- **Inertia.js** for seamless SPA experience
- **Tailwind CSS** for minimal, black & white design

## Data Scoping

All data is strictly scoped to the current organization:
- Contacts, notes, and custom fields are organization-specific
- No cross-organization data access
- Automatic organization_id injection on creation
- Global scope filtering on all queries

## Trade-offs and Decisions

- **SQLite**: Chosen for simplicity and zero-configuration setup
- **Session-based organization switching**: Simple and effective for single-user sessions
- **Avatar storage**: Public disk for easy access and development simplicity
- **Custom fields limit**: 5 fields maximum to prevent abuse and maintain performance
- **Duplicate handling**: Server-side validation with specific error responses for better UX

I followed every instruction.

