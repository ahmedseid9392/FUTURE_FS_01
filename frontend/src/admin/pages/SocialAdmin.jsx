import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X,
  CheckCircle,
  AlertCircle,
  Loader2,
  Link,
  Github,
  Linkedin,
  Twitter,
  Mail,
  Instagram,
  Facebook,
  Youtube,
  Globe
} from "lucide-react";
import API from "../../api/api";

export default function SocialAdmin() {
  const [socials, setSocials] = useState([]);
  const [form, setForm] = useState({
    name: "",
    url: "",
    icon: ""
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [notification, setNotification] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [previewIcon, setPreviewIcon] = useState(null);

  useEffect(() => { 
    fetchSocials(); 
  }, []);

  const fetchSocials = async () => {
    setLoading(true);
    try {
      const res = await API.get("/socials");
      setSocials(res.data || []);
    } catch (err) {
      console.error("Error fetching social links:", err);
      showNotification("Failed to load social links", "error");
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Get icon component based on name or icon class
  const getIconComponent = (iconName, platformName) => {
    const name = (iconName || platformName || "").toLowerCase();
    
    const iconMap = {
      'github': Github,
      'linkedin': Linkedin,
      'twitter': Twitter,
      'x': Twitter,
      'email': Mail,
      'mail': Mail,
      'instagram': Instagram,
      'facebook': Facebook,
      'youtube': Youtube,
      'globe': Globe,
      'website': Globe
    };
    
    const Icon = iconMap[name];
    return Icon || Link;
  };

  // Preview icon based on input
  useEffect(() => {
    const iconClass = form.icon || form.name;
    const Icon = getIconComponent(iconClass, form.name);
    setPreviewIcon(Icon);
  }, [form.icon, form.name]);

  const saveSocial = async () => {
    if (!form.name.trim()) {
      showNotification("Platform name is required", "error");
      return;
    }
    if (!form.url.trim()) {
      showNotification("URL is required", "error");
      return;
    }
    
    // Validate URL format
    try {
      new URL(form.url);
    } catch {
      showNotification("Please enter a valid URL (include http:// or https://)", "error");
      return;
    }

    setLoading(true);
    try {
      if (editingId) {
        await API.put(`/socials/${editingId}`, form);
        showNotification("Social link updated successfully", "success");
      } else {
        await API.post("/socials", form);
        showNotification("Social link added successfully", "success");
      }

      setForm({ name: "", url: "", icon: "" });
      setEditingId(null);
      setShowForm(false);
      fetchSocials();
    } catch (err) {
      console.error("Error saving social link:", err);
      showNotification("Failed to save social link", "error");
    } finally {
      setLoading(false);
    }
  };

  const editSocial = (s) => {
    setForm({
      name: s.name || "",
      url: s.url || "",
      icon: s.icon || ""
    });
    setEditingId(s._id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteSocial = async (id) => {
    if (!window.confirm("Are you sure you want to delete this social link?")) {
      return;
    }

    setDeleteLoading(id);
    try {
      await API.delete(`/socials/${id}`);
      showNotification("Social link deleted successfully", "success");
      fetchSocials();
    } catch (err) {
      console.error("Error deleting social link:", err);
      showNotification("Failed to delete social link", "error");
    } finally {
      setDeleteLoading(null);
    }
  };

  const cancelEdit = () => {
    setForm({ name: "", url: "", icon: "" });
    setEditingId(null);
    setShowForm(false);
  };

  // Common social platforms suggestions
  const commonPlatforms = [
    { name: "GitHub", icon: Github, placeholder: "https://github.com/username" },
    { name: "LinkedIn", icon: Linkedin, placeholder: "https://linkedin.com/in/username" },
    { name: "Twitter", icon: Twitter, placeholder: "https://twitter.com/username" },
    { name: "Instagram", icon: Instagram, placeholder: "https://instagram.com/username" },
    { name: "Facebook", icon: Facebook, placeholder: "https://facebook.com/username" },
    { name: "YouTube", icon: Youtube, placeholder: "https://youtube.com/@username" },
    { name: "Email", icon: Mail, placeholder: "mailto:email@example.com" },
    { name: "Website", icon: Globe, placeholder: "https://yourwebsite.com" }
  ];

  const selectPlatform = (platform) => {
    setForm({
      name: platform.name,
      url: "",
      icon: platform.name.toLowerCase()
    });
  };

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 }
  };

  const formVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { opacity: 1, height: "auto" }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
            Social Links
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
            Manage your social media and professional links
          </p>
        </div>
        
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all duration-300"
        >
          {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showForm ? "Cancel" : "Add Social Link"}
        </button>
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

      {/* Add/Edit Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            variants={formVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                  {editingId ? "Edit Social Link" : "Add New Social Link"}
                </h3>
                {editingId && (
                  <button
                    onClick={cancelEdit}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>

              {/* Platform Suggestions */}
              {!editingId && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Quick Select Platform
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {commonPlatforms.map((platform) => {
                      const PlatformIcon = platform.icon;
                      return (
                        <button
                          key={platform.name}
                          onClick={() => selectPlatform(platform)}
                          className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm"
                        >
                          <PlatformIcon className="w-4 h-4" />
                          {platform.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="space-y-4">
                {/* Icon Preview */}
                {previewIcon && (
                  <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                      {React.createElement(previewIcon, { className: "w-6 h-6 text-white" })}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Icon Preview</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {form.icon || "Using platform name for icon"}
                      </p>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Platform Name *
                  </label>
                  <input
                    placeholder="e.g., GitHub, LinkedIn, Twitter"
                    value={form.name}
                    onChange={(e) => setForm({...form, name: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    URL *
                  </label>
                  <div className="relative">
                    <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      placeholder="https://..."
                      value={form.url}
                      onChange={(e) => setForm({...form, url: e.target.value})}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Icon Class (Optional)
                  </label>
                  <input
                    placeholder="e.g., fab fa-github, or leave empty to auto-detect"
                    value={form.icon}
                    onChange={(e) => setForm({...form, icon: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Leave empty to automatically use the platform name
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={cancelEdit}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={saveSocial}
                  disabled={loading}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all duration-300 disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  {editingId ? "Update Link" : "Add Link"}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Social Links Grid */}
      {loading && socials.length === 0 ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        </div>
      ) : socials.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl">
          <Link className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">No social links yet</p>
          <button
            onClick={() => setShowForm(true)}
            className="mt-4 text-blue-500 hover:text-blue-600"
          >
            Add your first social link
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {socials.map((social) => {
              const IconComponent = getIconComponent(social.icon, social.name);
              
              return (
                <motion.div
                  key={social._id}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  whileHover={{ y: -5 }}
                  className="group bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700"
                >
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                          <IconComponent className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800 dark:text-white">
                            {social.name}
                          </h3>
                          <a
                            href={social.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-500 hover:text-blue-600 truncate block max-w-[150px]"
                            title={social.url}
                          >
                            {social.url.replace(/^https?:\/\//, '').substring(0, 30)}
                          </a>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-3 border-t border-gray-100 dark:border-gray-700">
                      <button
                        onClick={() => editSocial(social)}
                        className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors text-sm"
                      >
                        <Edit className="w-4 h-4" />
                        Edit
                      </button>
                      <button
                        onClick={() => deleteSocial(social._id)}
                        disabled={deleteLoading === social._id}
                        className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm disabled:opacity-50"
                      >
                        {deleteLoading === social._id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                        Delete
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}