# Permission System

This directory contains the permission system for the school management application.

## Components

### `Can` Component

The `Can` component is a React component that conditionally renders content based on user permissions.

#### Basic Usage

```tsx
import { Can } from "@/lib/can";

// Single permission check
<Can permission="create_students">
  <button>Add Student</button>
</Can>

// Multiple permissions - user needs ANY of the permissions
<Can permissions={["edit_students", "delete_students"]}>
  <div>Student Management</div>
</Can>

// Multiple permissions - user needs ALL permissions
<Can permissions={["view_students", "edit_students"]} requireAll={true}>
  <div>Full Student Access</div>
</Can>

// With custom fallback
<Can permission="admin_access" fallback={<div>Access Denied</div>}>
  <AdminPanel />
</Can>
```

#### Props

- `permission?: Permission` - Single permission to check
- `permissions?: Permission[]` - Array of permissions to check
- `requireAll?: boolean` - If true, user must have ALL permissions. If false, user must have ANY permission
- `fallback?: ReactNode` - Content to show when user doesn't have required permissions
- `children: ReactNode` - Content to show when user has required permissions

### `useAuth` Hook

The `useAuth` hook provides authentication and permission management functionality.

#### Permission Functions

```tsx
import { useAuth } from "@/lib/useAuth";

const { 
  hasPermission, 
  hasAnyPermission, 
  hasAllPermissions,
  permissions 
} = useAuth();

// Check single permission
if (hasPermission("create_students")) {
  // User can create students
}

// Check if user has ANY of the required permissions
if (hasAnyPermission(["edit_students", "delete_students"])) {
  // User can edit OR delete students
}

// Check if user has ALL required permissions
if (hasAllPermissions(["view_students", "edit_students"])) {
  // User can view AND edit students
}

// Access user's permissions array
console.log("User permissions:", permissions);
```

## How It Works

1. **Login**: When a user logs in, the system fetches their permissions from the backend
2. **Storage**: Permissions are stored in localStorage/sessionStorage based on "Remember Me" setting
3. **State**: Permissions are loaded into React state for immediate access
4. **Checks**: Permission checks are performed against the stored permissions array

## Backend Integration

The permission system integrates with the backend API:

- **Login**: `POST /users/signin` - Returns user data and token
- **Profile**: `GET /users/profile` - Returns user data with permissions array
- **Permissions**: Stored in `role_permissions` table linked to user roles

## Permission Types

Permissions are strings that represent specific actions or access levels. Examples:

- `create_students` - Can create new students
- `edit_students` - Can edit existing students
- `delete_students` - Can delete students
- `view_students` - Can view student information
- `admin_access` - Full administrative access

## Best Practices

1. **Use descriptive permission names** that clearly indicate what action is allowed
2. **Group related permissions** when using the `permissions` array
3. **Provide meaningful fallbacks** for better user experience
4. **Check permissions at component level** rather than hiding entire pages
5. **Use `requireAll` sparingly** - most cases only need `hasAnyPermission`
