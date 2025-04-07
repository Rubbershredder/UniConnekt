import React, { useState } from "react";
import { NavLink, Outlet, Form, useNavigate, useLocation } from "react-router";
import {
  Home,
  FolderKanban,
  Mail,
  BarChart3,
  Bell,
  Calendar,
  User,
  FileText,
  Menu,
  X,
  LogOut,
} from "lucide-react";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  // Define navigation items with their icons
  const navItems = [
    { path: "/", icon: <Home size={20} />, label: "Home" },
    { path: "/activity", icon: <BarChart3 size={20} />, label: "Activity" },
    { path: "/calendar", icon: <Calendar size={20} />, label: "Calendar" },
    // { path: "/notifications", icon: <Bell size={20} />, label: "Notifications" },
    { path: "/profile", icon: <User size={20} />, label: "Profile" },
    { path: "/projects", icon: <FolderKanban size={20} />, label: "Projects" },
    { path: "/blogs", icon: <FileText size={20} />, label: "Blogs" },
    { path: "/contact", icon: <Mail size={20} />, label: "Contact" },
  ];

  const profileMenuItems = [
    { path: "/profile", icon: <User size={20} />, label: "Profile" },
    { path: "/contact", icon: <Mail size={20} />, label: "Contact" },
    // Removed logout from here as we'll handle it separately
  ];

  // Items shown in mobile bottom navigation
  const mobileBottomItems = navItems.slice(0, 5);

  // Items to be shown in mobile dropdown menu
  const mobileDropdownItems = navItems.slice(5);

  const toggleProfileMenu = () => {
    setProfileMenuOpen(!profileMenuOpen);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleLogout = async () => {
    try {
      const response = await fetch("/logout", {
        method: "POST",
        credentials: "include",  // Important for cookies/sessions
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      // Handle successful logout even if server doesn't return content
      if (response.status === 200 || response.status === 204) {
        navigate("/login");
        return;
      }
  
      // Handle specific error statuses
      const data = await response.json();
      console.error("Logout failed:", data.message);
    } catch (error) {
      console.error("Network error:", error);
    } finally {
      setProfileMenuOpen(false);
    }
  };

  return (
    <div className="flex flex-col">
      {/* Top Navbar - fixed at the top */}
      <header className="fixed top-0 left-0 right-0 bg-white text-[#0044B1] z-30 shadow-md">
        <div className="container mx-auto">
          {/* Desktop Navigation - only visible on iPad Pro and larger (1024px+) */}
          <div className="hidden lg:flex items-center justify-between h-16 px-4">
            {/* Logo area */}
            <div className="flex items-center space-x-2">
              <NavLink to="/">
                {" "}
                <img
                  src="/favicon.png"
                  alt="Logo"
                  className="h-15 w-auto"
                />{" "}
              </NavLink>
            </div>

            {/* Navigation links with hover effect */}
            <nav className="flex items-center space-x-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center px-3 py-2 rounded-md transition-colors ${
                      isActive
                        ? "bg-[#1EC773] text-[#0044B1]"
                        : "text-[#0044B1] hover:bg-[#1EC773] hover:text-[#0044B1]"
                    }`
                  }
                >
                  <span className="mr-2">{item.icon}</span>
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </nav>

            {/* User profile/actions area */}
            <div className="flex items-center relative">
              <button
                className="p-2 rounded-full text-[#0044B1] hover:bg-[#1EC773]"
                onClick={toggleProfileMenu}
              >
                <User size={20} />
              </button>

              {/* Profile dropdown menu */}
              {profileMenuOpen && (
                <div className="absolute right-0 top-12 w-48 bg-white rounded-md shadow-lg z-50 border border-gray-200">
                  {/* Profile menu items */}
                  {profileMenuItems.map((item, index) => (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      className={({ isActive }) =>
                        `flex items-center px-4 py-3 ${
                          isActive
                            ? "bg-[#1EC773] text-[#0044B1]"
                            : "text-[#0044B1] hover:bg-[#1EC773]"
                        } ${index === 0 ? "rounded-t-md" : ""}`
                      }
                      onClick={() => setProfileMenuOpen(false)}
                    >
                      <span className="mr-2">{item.icon}</span>
                      <span>{item.label}</span>
                    </NavLink>
                  ))}

                  {/* Logout Button */}
                  <button
                    className="flex items-center w-full px-4 py-3 text-left text-[#0044B1] hover:bg-[#1EC773] rounded-b-md"
                    onClick={handleLogout}
                  >
                    <span className="mr-2">
                      <LogOut size={20} />
                    </span>
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Navigation - visible on all screens below iPad Pro (below 1024px) */}
          <div className="lg:hidden flex items-center justify-between h-14 px-4">
            <div className="flex items-center space-x-2">
              <NavLink to="/">
                <img src="/favicon.png" alt="Logo" className="h-15 w-auto" />
              </NavLink>
            </div>

            {/* Mobile dropdown menu button */}
            <button
              className="p-2 rounded-md text-[#0044B1] hover:bg-gray-100"
              onClick={toggleMobileMenu}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-200 shadow-md">
            <div className="px-4 py-2">
              {mobileDropdownItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center py-3 px-2 ${
                      isActive ? "text-[#1EC773]" : "text-[#0044B1]"
                    }`
                  }
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="mr-3">{item.icon}</span>
                  <span>{item.label}</span>
                </NavLink>
              ))}

              {/* Mobile Logout Button */}
              <button
                className="flex items-center py-3 px-2 text-[#0044B1] w-full text-left"
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
              >
                <span className="mr-3">
                  <LogOut size={20} />
                </span>
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Mobile Bottom Navigation - visible on all screens below iPad Pro */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 lg:hidden z-20">
        <div className="flex justify-around items-center h-16">
          {mobileBottomItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center p-2 text-xs ${
                  isActive ? "text-[#0044B1]" : "text-gray-500"
                }`
              }
            >
              {item.icon}
              <span className="mt-1 text-[10px]">{item.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}
