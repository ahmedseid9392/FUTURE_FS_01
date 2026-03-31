// admin/Dashboard.jsx
import { Routes, Route, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";

import Overview from "./pages/Overview";
import ProjectsAdmin from "./pages/ProjectAdmin";
import SkillsAdmin from "./pages/SkillAdmin";
import ProfileAdmin from "./pages/ProfileAdmin";
import MessagesAdmin from "./pages/MessagesAdmin";
import AboutAdmin from "./pages/AboutAdmin";
import SocialAdmin from "./pages/SocialAdmin";
import Settings from "./pages/SettingsAdmin";

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setSidebarOpen(false);
      }
    };
    
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (isMobile && sidebarOpen) {
      setSidebarOpen(false);
    }
  }, [location, isMobile]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const getPageTitle = () => {
    const path = location.pathname.split("/").pop();
    const titles = {
      "": "Dashboard Overview",
      projects: "Projects Management",
      skills: "Skills Management",
      profile: "Profile Settings",
      about: "About Section",
      messages: "Messages & Inquiries",
      social: "Social Links",
      settings: "System Settings"
    };
    return titles[path] || "Admin Panel";
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      {/* Main Content */}
      <div className={`${!isMobile ? "ml-72" : ""} transition-all duration-300`}>
        <Header onMenuClick={toggleSidebar} pageTitle={getPageTitle()} />
        
        <main className="p-4 md:p-6 lg:p-8">
          <Routes>
            <Route index element={<Overview />} />
            <Route path="projects" element={<ProjectsAdmin />} />
            <Route path="skills" element={<SkillsAdmin />} />
            <Route path="profile" element={<ProfileAdmin />} />
            <Route path="about" element={<AboutAdmin />} />
            <Route path="messages" element={<MessagesAdmin />} />
            <Route path="social" element={<SocialAdmin />} />
            <Route path="settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
