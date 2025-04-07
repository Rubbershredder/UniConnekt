need to work on the following next  
Role-Based Access Control (RBAC) Implementation Guide

## Overview

This guide outlines how to implement a Role-Based Access Control (RBAC) system in your application. Your application currently uses a Go backend with Gin framework for API endpoints and JWT authentication, with a React frontend using React Router for navigation.

## Current Authentication System

Your current authentication system includes:
- JWT-based authentication in the Go backend
- Cookie-based session management in the React frontend
- User model with basic authentication fields

## RBAC Implementation Approach

Since you already have a solid authentication system in place, extending it for RBAC is more efficient than switching to a new platform like Strapi or PocketBase.

## Role Hierarchy

```
System → Admin
System → Member → Student
System → Member → Professional
System → Member → College
```

## 1. Database Schema Changes

### Extend User Model in Go

```go
type User struct {
    gorm.Model
    Email      string `gorm:"unique"`
    Password   string
    Role       string // "system", "admin", "student", "professional", "college"
    IsVerified bool
    CollegeID  *uint  // Nullable reference to college for students/alumni
    // Other fields as needed
}
```

### Create Permissions Table

```go
type Permission struct {
    gorm.Model
    Role             string `gorm:"uniqueIndex"`
    CanPostBounty    bool
    CanHostEvent     bool
    CanBanUsers      bool
    CanViewAnalytics bool
    // Other permissions as needed
}
```

## 2. Backend RBAC Implementation

### Role-checking Middleware

Create a new middleware in the `middleware` package:

```go
// middleware/rbac.go
func RequireRole(roles ...string) gin.HandlerFunc {
    return func(c *gin.Context) {
        user, exists := c.Get("user")
        if !exists {
            c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
            return
        }
        
        userModel, ok := user.(models.User)
        if !ok {
            c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "Server error"})
            return
        }
        
        // Check if user's role is in the allowed roles list
        for _, role := range roles {
            if userModel.Role == role {
                c.Next()
                return
            }
        }
        
        c.AbortWithStatusJSON(http.StatusForbidden, gin.H{"error": "Access denied"})
    }
}
```

### Apply Middleware to Routes

Update your routes in `main.go`:

```go
// Admin routes
router.GET("/admin/dashboard", middleware.RequireAuth, middleware.RequireRole("admin"), controllers.AdminDashboard)

// Professional/College routes
router.POST("/bounties", middleware.RequireAuth, middleware.RequireRole("professional", "college", "admin"), controllers.CreateBounty)
router.POST("/events", middleware.RequireAuth, middleware.RequireRole("professional", "college", "admin"), controllers.CreateEvent)

// Student routes
router.POST("/bounties/:id/submit", middleware.RequireAuth, middleware.RequireRole("student", "admin"), controllers.SubmitBountySolution)
```

### Initialize Default Permissions

Create a function to initialize default permissions:

```go
// initializers/rbac.go
func InitializePermissions() {
    permissions := []models.Permission{
        {Role: "system", CanPostBounty: false, CanHostEvent: false, CanBanUsers: true, CanViewAnalytics: true},
        {Role: "admin", CanPostBounty: true, CanHostEvent: true, CanBanUsers: true, CanViewAnalytics: true},
        {Role: "student", CanPostBounty: false, CanHostEvent: false, CanBanUsers: false, CanViewAnalytics: false},
        {Role: "professional", CanPostBounty: true, CanHostEvent: true, CanBanUsers: false, CanViewAnalytics: false},
        {Role: "college", CanPostBounty: true, CanHostEvent: true, CanBanUsers: false, CanViewAnalytics: true},
    }
    
    for _, perm := range permissions {
        initializers.DB.Where(models.Permission{Role: perm.Role}).FirstOrCreate(&perm)
    }
}
```

Call this function in your `main.go`:

```go
func init() {
    initializers.LoadEnvVar()
    initializers.ConnectToDb()
    initializers.SyncDb()
    initializers.InitializePermissions()
}
```

### Permission Checking in Controllers

For operations that need more complex permission checks:

```go
// controllers/bounty.go
func EditBounty(c *gin.Context) {
    user := c.MustGet("user").(models.User)
    bountyID := c.Param("id")
    
    // Get bounty from DB
    var bounty models.Bounty
    result := initializers.DB.First(&bounty, bountyID)
    if result.Error != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "Bounty not found"})
        return
    }
    
    // Check if user is admin or the bounty creator
    if user.Role != "admin" && bounty.CreatorID != user.ID {
        c.JSON(http.StatusForbidden, gin.H{"error": "Not authorized to edit this bounty"})
        return
    }
    
    // Proceed with edit operation...
}
```

### Update SignUp Process

Modify your signup controller to include role assignment:

```go
// controllers/auth.go
func SignUp(ctx *gin.Context) {
    // Existing code...

    // By default, assign "student" role to new users
    user := models.User{Email: body.Email, Password: string(hash), Role: "student"}
    result := initializers.DB.Create(&user)

    // Rest of your existing code...
}
```

### Add Audit Logging

Create an audit log model and system:

```go
// models/audit_log.go
type AuditLog struct {
    gorm.Model
    UserID    uint
    Action    string
    Target    string
    TargetID  uint
    Timestamp time.Time
}

// utils/audit.go
func LogAction(userID uint, action string, target string, targetID uint) {
    log := models.AuditLog{
        UserID:    userID,
        Action:    action,
        Target:    target,
        TargetID:  targetID,
        Timestamp: time.Now(),
    }
    initializers.DB.Create(&log)
}
```

## 3. Frontend RBAC Implementation

### Update Your Auth Context

First, modify your auth context to include role information:

```tsx
// context/auth-context.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';

type User = {
  id: string;
  email: string;
  role: string;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  hasRole: (roles: string | string[]) => boolean;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  hasRole: () => false,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Fetch user data on mount
    async function loadUser() {
      try {
        const response = await fetch("/api/user");
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        }
      } finally {
        setIsLoading(false);
      }
    }
    
    loadUser();
  }, []);
  
  // Helper function to check if user has one of the specified roles
  const hasRole = (roles: string | string[]) => {
    if (!user) return false;
    
    if (typeof roles === 'string') {
      return user.role === roles;
    }
    
    return roles.includes(user.role);
  };
  
  return (
    <AuthContext.Provider value={{ user, isLoading, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
```

### Create Role-Based Route Protection

Create a component to protect routes based on roles:

```tsx
// components/protected-route.tsx
import { Navigate, useLocation } from 'react-router';
import { useAuth } from '../context/auth-context';

type ProtectedRouteProps = {
  children: React.ReactNode;
  allowedRoles: string[];
};

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, isLoading, hasRole } = useAuth();
  const location = useLocation();
  
  if (isLoading) {
    return <div>Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  if (!hasRole(allowedRoles)) {
    return <Navigate to="/unauthorized" replace />;
  }
  
  return <>{children}</>;
}
```

### Use the Protected Route Component

In your route definitions:

```tsx
// routes.tsx
import { ProtectedRoute } from './components/protected-route';
import AdminDashboard from './pages/admin-dashboard';
import CreateBounty from './pages/create-bounty';

// In your router configuration:
{
  path: "/admin/dashboard",
  element: (
    <ProtectedRoute allowedRoles={["admin"]}>
      <AdminDashboard />
    </ProtectedRoute>
  )
},
{
  path: "/bounties/new",
  element: (
    <ProtectedRoute allowedRoles={["professional", "college", "admin"]}>
      <CreateBounty />
    </ProtectedRoute>
  )
}
```

### Conditional Rendering Based on Role

In your components:

```tsx
import { useAuth } from '../context/auth-context';

function Dashboard() {
  const { user, hasRole } = useAuth();
  
  return (
    <div>
      <h1>Dashboard</h1>
      
      {/* Everyone sees this */}
      <RecentActivities />
      
      {/* Conditional rendering based on role */}
      {hasRole("student") && <AvailableBounties />}
      
      {hasRole(["professional", "college"]) && (
        <div>
          <MyCreatedBounties />
          <CreateBountyButton />
        </div>
      )}
      
      {hasRole("admin") && <AdminControls />}
    </div>
  );
}
```

## 4. Implementation Strategy

1. **Database Schema Updates**
   - Add role field to User model
   - Create Permissions table
   - Add migration for existing users

2. **Backend Changes**
   - Implement role-checking middleware
   - Apply middleware to routes
   - Update controllers with role checks
   - Add role field to JWT claims

3. **Frontend Changes**
   - Update auth context to include role information
   - Create protected route component
   - Update components with conditional rendering

4. **Testing**
   - Test different user types and access patterns
   - Verify that users can only access appropriate resources

## 5. Additional Considerations

### Role Assignment

- Default role should be "student" for new signups
- Add admin interface for role management
- Implement verification process for "professional" and "college" roles

### Audit Logging

- Log important actions (role changes, user bans, etc.)
- Create admin view for audit logs

### Security Best Practices

- Validate roles on the server for all sensitive operations
- Never trust client-side role information
- Use principle of least privilege
- Implement role transition approvals

## Conclusion

This RBAC implementation leverages your existing authentication system while adding the necessary role-based controls. It's scalable and can be extended with additional roles and permissions as your application grows.

Start with the core functionality (role checking middleware and basic UI conditionals) before adding more complex features like audit logging and role transitions.
