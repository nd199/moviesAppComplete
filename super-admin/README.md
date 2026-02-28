# SuperAdmin Panel

A separate React application for SuperAdmin functionality, completely isolated from the regular admin panel.

## Features

- SuperAdmin Login
- Send Admin Invites (email only)
- Success/Error popup notifications
- Copy invite link functionality

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

The app will run on port 3001 (different from the main admin app).

## Pages

- `/super-admin/login` - SuperAdmin login page
- `/super-admin/invite` - Send admin invites page

## API Endpoints

- `POST /api/v1/superadmin/invite` - Send admin invite
- `POST /api/v1/superadmin/auth/login` - SuperAdmin login

## Design

- Red color scheme to distinguish from regular admin panel
- Simple, focused interface
- Popup notifications instead of separate pages
- Mobile responsive design
