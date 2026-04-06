
import { NavLink, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  FolderGit2, 
  Code2, 
  User, 
  Info, 
  Share2, 
  Mail, 
  Settings,
  LogOut,
  X
} from "lucide-react";

export default function Sidebar({ isOpen, onClose }) {
  const location = useLocation();

  const links = [
    { name: "Overview", path: "", icon: LayoutDashboard, color: "from-blue-500 to-blue-600" },
    { name: "Projects", path: "projects", icon: FolderGit2, color: "from-green-500 to-green-600" },
    { name: "Skills", path: "skills", icon: Code2, color: "from-purple-500 to-purple-600" },
    { name: "Profile", path: "profile", icon: User, color: "from-indigo-500 to-indigo-600" },
    { name: "About", path: "about", icon: Info, color: "from-pink-500 to-pink-600" },
    { name: "Social Media", path: "social", icon: Share2, color: "from-red-500 to-red-600" },
    { name: "Messages", path: "messages", icon: Mail, color: "from-yellow-500 to-yellow-600" },
    { name: "Settings", path: "settings", icon: Settings, color: "from-gray-500 to-gray-600" }
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("rememberedEmail");
    window.location.href = "/";
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo Section */}
      <div className="p-6 border-b border-gray-700/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-xl">A</span>
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Admin Panel
            </h1>
            <p className="text-xs text-gray-400">Portfolio Manager</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-6 px-4">
        <div className="space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === `/admin/${link.path}` || 
                            (link.path === "" && location.pathname === "/admin");
            
            return (
              <NavLink
                key={link.path}
                to={`/admin/${link.path}`}
                onClick={() => {
                  if (window.innerWidth < 768) {
                    onClose?.();
                  }
                }}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                  ${isActive 
                    ? `bg-gradient-to-r ${link.color} text-white shadow-lg` 
                    : "text-gray-300 hover:bg-gray-700/50 hover:text-white"
                  }
                `}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{link.name}</span>
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white"></div>
                )}
              </NavLink>
            );
          })}
        </div>
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-700/50">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-200"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );

  // Mobile sidebar
  if (window.innerWidth < 768) {
    return (
      <>
        {isOpen && (
          <>
            {/* Overlay */}
            <div 
              className="fixed inset-0 bg-black/50 z-40"
              onClick={onClose}
            />
            
            {/* Sidebar */}
            <aside className="fixed left-0 top-0 z-50 h-full w-72 bg-gradient-to-b from-gray-900 to-gray-800 text-white shadow-2xl">
              <div className="relative h-full">
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-700 transition-colors z-10"
                >
                  <X className="w-5 h-5" />
                </button>
                <SidebarContent />
              </div>
            </aside>
          </>
        )}
      </>
    );
  }

  // Desktop sidebar
  return (
    <aside className="fixed left-0 top-0 h-full w-72 bg-gradient-to-b from-gray-900 to-gray-800 text-white shadow-2xl overflow-y-auto">
      <SidebarContent />
    </aside>
  );
}
