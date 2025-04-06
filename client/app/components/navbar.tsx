import React, { useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router";
import { Home, FolderKanban, Mail, BarChart3, Bell, Calendar, User, FileText, Menu, X } from "lucide-react";

export default function Navbar() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Define navigation items with their icons
  const navItems = [
    { path: "/", icon: <Home size={20} />, label: "Home" },
    { path: "/activity", icon: <BarChart3 size={20} />, label: "Activity" },
    { path: "/calendar", icon: <Calendar size={20} />, label: "Calendar" },
    { path: "/notifications", icon: <Bell size={20} />, label: "Notifications" },
    { path: "/profile", icon: <User size={20} />, label: "Profile" },
    { path: "/projects", icon: <FolderKanban size={20} />, label: "Projects" },
    { path: "/blogs", icon: <FileText size={20} />, label: "Blogs" },
    { path: "/contact", icon: <Mail size={20} />, label: "Contact" }
  ];

  // Items shown in mobile bottom navigation
  const mobileBottomItems = navItems.slice(0, 5);
  
  // Items to be shown in mobile dropdown menu
  const mobileDropdownItems = navItems.slice(5);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className="flex flex-col ">
      {/* Top Navbar - fixed at the top */}
      <header className="fixed top-0 left-0 right-0 bg-white text-[#0044B1] z-30 shadow-md">
        <div className="container mx-auto">
          {/* Desktop Navigation */}
          <div className="hidden sm:flex items-center justify-between h-16 px-4">
            {/* Logo area */}
            <div className="flex items-center space-x-2">
              <img src="/favicon.png" alt="Logo" className="h-30 w-auto" />
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
                        ? "bg-[#1EC773] text-white" 
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
            <div className="flex items-center">
              <button className="p-2 rounded-full text-[#0044B1] hover:bg-[#1EC773]">
                <User size={20} />
              </button>
            </div>
          </div>
          
          {/* Mobile Navigation */}
          <div className="sm:hidden flex items-center justify-between h-14 px-4">
            <div className="flex items-center space-x-2">
              <img src="/favicon.png" alt="Logo" className="h-30 w-auto" />
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
          <div className="sm:hidden bg-white border-t border-gray-200 shadow-md">
            <div className="px-4 py-2">
              {mobileDropdownItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center py-3 px-2 ${
                      isActive 
                        ? "text-[#1EC773]" 
                        : "text-[#0044B1]"
                    }`
                  }
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="mr-3">{item.icon}</span>
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </div>
          </div>
        )}
      </header>
      
      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 sm:hidden z-20">
        <div className="flex justify-around items-center h-16">
          {mobileBottomItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center p-2 text-xs ${
                  isActive 
                    ? "text-[#0044B1]" 
                    : "text-gray-500"
                }`
              }
            >
              {item.icon}
              <span className="mt-1 text-[10px]">{item.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
      
      {/* Main content area with proper padding to account for top navbar */}
      {/*  */}
    </div>
  );
}