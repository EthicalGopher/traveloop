# Project Instructions: Traveloop

## Development Workflow
- **Service Management:** Always run `make restart` after making any code changes to the backend or frontend to ensure the Docker containers are updated with the latest code.

## Architecture & Roles
- **Roles:** The system uses a two-role structure: `public` and `admin`.
- **Routing:** Admin-specific pages are prefixed with `/admin`. Unauthenticated or non-admin users attempting to access `/admin` are redirected to `/login` or `/` respectively.
- **Admin Signup:** The email `admin@traveloop.com` is automatically granted the `admin` role during signup for bootstrap/testing purposes.
