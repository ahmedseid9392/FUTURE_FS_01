import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Save, 
  Lock, 
  UserPlus, 
  Settings as SettingsIcon,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  Loader2,
  Globe,
  Palette,
  Layout,
  Mail,
  Key,
  Shield,
  Moon,
  Sun,
  Monitor,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import API from "../../api/api";
import toast from "react-hot-toast";

export default function SettingsAdmin() {
  const [password, setPassword] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [admin, setAdmin] = useState({
    email: "",
    password: ""
  });
  const [settings, setSettings] = useState({
    siteTitle: "",
    logo: "",
    cv: "",
    theme: "light",
    seo: {
      title: "",
      description: ""
    },
    sections: {
      skills: true,
      projects: true,
      about: true,
      contact: true
    }
  });
  const [loading, setLoading] = useState({
    settings: false,
    password: false,
    admin: false,
    save: false
  });
  const [notification, setNotification] = useState(null);
  const [activeTab, setActiveTab] = useState("general");
  const [showPasswordValidation, setShowPasswordValidation] = useState(false);

  // Fetch settings ONCE
  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(prev => ({ ...prev, settings: true }));
    try {
      const res = await API.get("/settings");
      setSettings(res.data);
    } catch (err) {
      console.error("Error fetching settings:", err);
      toast.error("Failed to load settings");
      showNotification("Failed to load settings", "error");
    } finally {
      setLoading(prev => ({ ...prev, settings: false }));
    }
  };

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Password validation
  const validatePassword = () => {
    if (password.newPassword !== password.confirmPassword) {
      toast.error("New passwords do not match");
      return false;
    }
    if (password.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return false;
    }
    return true;
  };

  // Change password
  const handlePassword = async () => {
    if (!password.currentPassword || !password.newPassword) {
      toast.error("Please fill all password fields");
      return;
    }
    if (!validatePassword()) return;

    setLoading(prev => ({ ...prev, password: true }));
    try {
      await API.post("/auth/change-password", {
        currentPassword: password.currentPassword,
        newPassword: password.newPassword
      });
      toast.success("Password changed successfully");
      showNotification("Password changed successfully", "success");
      setPassword({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setShowPasswordValidation(false);
    } catch (err) {
      console.error("Error changing password:", err);
      toast.error("Failed to change password. Please check your current password.");
      showNotification("Failed to change password", "error");
    } finally {
      setLoading(prev => ({ ...prev, password: false }));
    }
  };

  // Create admin
  const handleCreateAdmin = async () => {
    if (!admin.email || !admin.password) {
      toast.error("Please fill all fields");
      return;
    }
    if (admin.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(prev => ({ ...prev, admin: true }));
    try {
      await API.post("/auth/register-admin", admin);
      toast.success("Admin created successfully");
      showNotification("Admin created successfully", "success");
      setAdmin({ email: "", password: "" });
    } catch (err) {
      console.error("Error creating admin:", err);
      toast.error("Failed to create admin");
      showNotification("Failed to create admin", "error");
    } finally {
      setLoading(prev => ({ ...prev, admin: false }));
    }
  };

  // Save settings
  const saveSettings = async () => {
    setLoading(prev => ({ ...prev, save: true }));
    try {
      await API.put("/settings", settings);
      toast.success("Settings updated successfully");
      showNotification("Settings updated successfully", "success");
    } catch (err) {
      console.error("Error saving settings:", err);
      toast.error("Failed to update settings");
      showNotification("Failed to update settings", "error");
    } finally {
      setLoading(prev => ({ ...prev, save: false }));
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  // Theme options
  const themes = [
    { value: "light", label: "Light", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon },
    { value: "system", label: "System", icon: Monitor }
  ];

  // Tabs configuration
  const tabs = [
    { id: "general", label: "General Settings", icon: SettingsIcon },
    { id: "security", label: "Security", icon: Shield },
    { id: "admin", label: "Admin Management", icon: UserPlus }
  ];

  const sectionToggles = [
    { key: "skills", label: "Skills Section", description: "Show/hide skills section on portfolio" },
    { key: "projects", label: "Projects Section", description: "Show/hide projects section on portfolio" },
    { key: "about", label: "About Section", description: "Show/hide about section on portfolio" },
    { key: "contact", label: "Contact Section", description: "Show/hide contact section on portfolio" }
  ];

  // Prevent crash
  if (loading.settings && !settings) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
          Settings
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
          Configure your portfolio settings and manage security
        </p>
      </div>

      {/* Notification Toast */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-20 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg ${
              notification.type === "error" 
                ? "bg-red-500 text-white" 
                : "bg-green-500 text-white"
            }`}
          >
            {notification.type === "error" ? (
              <AlertCircle className="w-4 h-4" />
            ) : (
              <CheckCircle className="w-4 h-4" />
            )}
            <span className="text-sm">{notification.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors relative ${
                activeTab === tab.id
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"
                />
              )}
            </button>
          );
        })}
      </div>

      {/* General Settings Tab */}
      {activeTab === "general" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700"
        >
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <SettingsIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                Site Settings
              </h3>
            </div>

            <div className="space-y-4">
              {/* Site Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Site Title
                </label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    value={settings.siteTitle}
                    onChange={(e) =>
                      setSettings({ ...settings, siteTitle: e.target.value })
                    }
                    placeholder="My Portfolio"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  This appears in the browser tab and search results
                </p>
              </div>

              {/* Theme */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Theme
                </label>
                <div className="relative">
                  <Palette className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <select
                    value={settings.theme}
                    onChange={(e) =>
                      setSettings({ ...settings, theme: e.target.value })
                    }
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {themes.map(theme => (
                      <option key={theme.value} value={theme.value}>
                        {theme.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Section Toggles */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Visible Sections
                </label>
                <div className="space-y-3">
                  {sectionToggles.map((section) => (
                    <label
                      key={section.key}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <div>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {section.label}
                        </span>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {section.description}
                        </p>
                      </div>
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={settings?.sections?.[section.key] || false}
                          onChange={(e) =>
                            setSettings({
                              ...settings,
                              sections: {
                                ...settings.sections,
                                [section.key]: e.target.checked
                              }
                            })
                          }
                          className="w-5 h-5 text-blue-500 rounded focus:ring-blue-500"
                        />
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* SEO Settings */}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  SEO Settings
                </label>
                <div className="space-y-3">
                  <input
                    value={settings.seo?.title || ""}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        seo: { ...settings.seo, title: e.target.value }
                      })
                    }
                    placeholder="SEO Title"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <textarea
                    value={settings.seo?.description || ""}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        seo: { ...settings.seo, description: e.target.value }
                      })
                    }
                    placeholder="SEO Description"
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>
              </div>

              {/* Save Button */}
              <div className="flex justify-end pt-4">
                <button
                  onClick={saveSettings}
                  disabled={loading.save}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all duration-300 disabled:opacity-50"
                >
                  {loading.save ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  Save Settings
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Security Tab - Change Password */}
      {activeTab === "security" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700"
        >
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                <Lock className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                Change Password
              </h3>
            </div>

            <div className="space-y-4">
              {/* Current Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Current Password
                </label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type={showPasswords.current ? "text" : "password"}
                    placeholder="Enter current password"
                    value={password.currentPassword}
                    onChange={(e) =>
                      setPassword({ ...password, currentPassword: e.target.value })
                    }
                    className="w-full pl-10 pr-12 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("current")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPasswords.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type={showPasswords.new ? "text" : "password"}
                    placeholder="Enter new password"
                    value={password.newPassword}
                    onChange={(e) =>
                      setPassword({ ...password, newPassword: e.target.value })
                    }
                    className="w-full pl-10 pr-12 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("new")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPasswords.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type={showPasswords.confirm ? "text" : "password"}
                    placeholder="Confirm new password"
                    value={password.confirmPassword}
                    onChange={(e) =>
                      setPassword({ ...password, confirmPassword: e.target.value })
                    }
                    className="w-full pl-10 pr-12 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("confirm")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPasswords.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {password.newPassword && password.confirmPassword && password.newPassword !== password.confirmPassword && (
                  <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
                )}
              </div>

              {/* Update Button */}
              <div className="flex justify-end pt-4">
                <button
                  onClick={handlePassword}
                  disabled={loading.password}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg hover:shadow-lg transition-all duration-300 disabled:opacity-50"
                >
                  {loading.password ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Lock className="w-4 h-4" />
                  )}
                  Update Password
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Admin Management Tab */}
      {activeTab === "admin" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700"
        >
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <UserPlus className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                Create New Admin
              </h3>
            </div>

            <div className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Admin Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    placeholder="admin@example.com"
                    value={admin.email}
                    onChange={(e) =>
                      setAdmin({ ...admin, email: e.target.value })
                    }
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Admin Password
                </label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="password"
                    placeholder="Enter password (min 6 characters)"
                    value={admin.password}
                    onChange={(e) =>
                      setAdmin({ ...admin, password: e.target.value })
                    }
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>

              {/* Create Button */}
              <div className="flex justify-end pt-4">
                <button
                  onClick={handleCreateAdmin}
                  disabled={loading.admin}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:shadow-lg transition-all duration-300 disabled:opacity-50"
                >
                  {loading.admin ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <UserPlus className="w-4 h-4" />
                  )}
                  Create Admin
                </button>
              </div>

              <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <p className="text-xs text-yellow-700 dark:text-yellow-400">
                  <strong>Note:</strong> New admin accounts will have full access to the admin panel. 
                  Make sure to use a secure password and share credentials securely.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}