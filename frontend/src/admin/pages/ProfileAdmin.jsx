import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, 
  Upload,
  Save,
  Edit,
  Trash2,
  X,
  CheckCircle,
  AlertCircle,
  Loader2,
  Star,
  FileText,
  Download
} from "lucide-react";
import API from "../../api/api";

export default function ProfileAdmin() {
  const [profiles, setProfiles] = useState([]);
  const [form, setForm] = useState({
    name: "",
    title: "",
    bio: "",
    image: "",
    cv: ""
  });
  const [editingId, setEditingId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadType, setUploadType] = useState(null);
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [activeLoading, setActiveLoading] = useState(null);
  const [notification, setNotification] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const imageInputRef = useRef(null);
  const cvInputRef = useRef(null);

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    setLoading(true);
    try {
      const res = await API.get("/profile");
      setProfiles(res.data || []);
    } catch (err) {
      console.error("Error fetching profiles:", err);
      showNotification("Failed to load profiles", "error");
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Upload file (image or CV)
  const uploadFile = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      showNotification("File size should be less than 5MB", "error");
      return;
    }

    if (type === "image" && !file.type.startsWith('image/')) {
      showNotification("Please upload an image file", "error");
      return;
    }

    setUploading(true);
    setUploadType(type);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await API.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setForm(prev => ({
        ...prev,
        [type]: res.data.imageUrl
      }));
      showNotification(`${type === "image" ? "Image" : "CV"} uploaded successfully`, "success");
    } catch (err) {
      console.error("Upload error:", err);
      showNotification(`Failed to upload ${type}`, "error");
    } finally {
      setUploading(false);
      setUploadType(null);
    }
  };

  // Save profile
  const saveProfile = async () => {
    // Validate required fields
    if (!form.name.trim()) {
      showNotification("Name is required", "error");
      return;
    }
    if (!form.title.trim()) {
      showNotification("Title is required", "error");
      return;
    }
    if (!form.bio.trim()) {
      showNotification("Bio is required", "error");
      return;
    }

    setLoading(true);
    try {
      if (editingId) {
        await API.put(`/profile/${editingId}`, form);
        showNotification("Profile updated successfully", "success");
      } else {
        await API.post("/profile", form);
        showNotification("Profile added successfully", "success");
      }

      // Reset form
      setForm({
        name: "",
        title: "",
        bio: "",
        image: "",
        cv: ""
      });
      setEditingId(null);
      setShowForm(false);
      fetchProfiles();
    } catch (err) {
      console.error("Save error:", err);
      showNotification("Failed to save profile", "error");
    } finally {
      setLoading(false);
    }
  };

  // Edit profile
  const editProfile = (p) => {
    setForm({
      name: p.name || "",
      title: p.title || "",
      bio: p.bio || "",
      image: p.image || "",
      cv: p.cv || ""
    });
    setEditingId(p._id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Delete profile
  const deleteProfile = async (id) => {
    if (!window.confirm("Are you sure you want to delete this profile? This action cannot be undone.")) {
      return;
    }

    setDeleteLoading(id);
    try {
      await API.delete(`/profile/${id}`);
      showNotification("Profile deleted successfully", "success");
      fetchProfiles();
    } catch (err) {
      console.error("Delete error:", err);
      showNotification("Failed to delete profile", "error");
    } finally {
      setDeleteLoading(null);
    }
  };

  // Set active profile
  const setActiveProfile = async (id) => {
    setActiveLoading(id);
    try {
      await API.put(`/profile/active/${id}`);
      showNotification("Active profile updated", "success");
      fetchProfiles();
    } catch (err) {
      console.error("Error setting active profile:", err);
      showNotification("Failed to set active profile", "error");
    } finally {
      setActiveLoading(null);
    }
  };

  const cancelEdit = () => {
    setForm({
      name: "",
      title: "",
      bio: "",
      image: "",
      cv: ""
    });
    setEditingId(null);
    setShowForm(false);
  };

  // Fallback image handler
  const handleImageError = (e) => {
    e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 24 24' fill='none' stroke='%239ca3af' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2'%3E%3C/path%3E%3Ccircle cx='12' cy='7' r='4'%3E%3C/circle%3E%3C/svg%3E";
  };

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
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
            Manage Profiles
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
            Create and manage your portfolio profiles (only one can be active at a time)
          </p>
        </div>
        
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all duration-300"
        >
          {showForm ? <X className="w-4 h-4" /> : <User className="w-4 h-4" />}
          {showForm ? "Cancel" : "Add New Profile"}
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
                  {editingId ? "Edit Profile" : "Create New Profile"}
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

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Full Name *
                  </label>
                  <input
                    value={form.name}
                    onChange={(e) => setForm({...form, name: e.target.value})}
                    placeholder="e.g., John Doe"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Professional Title *
                  </label>
                  <input
                    value={form.title}
                    onChange={(e) => setForm({...form, title: e.target.value})}
                    placeholder="e.g., Full Stack Developer"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Bio *
                  </label>
                  <textarea
                    value={form.bio}
                    onChange={(e) => setForm({...form, bio: e.target.value})}
                    placeholder="Tell us about yourself..."
                    rows="4"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Profile Image
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => imageInputRef.current.click()}
                      disabled={uploading && uploadType === "image"}
                      className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                    >
                      {uploading && uploadType === "image" ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Upload className="w-4 h-4" />
                      )}
                      {uploading && uploadType === "image" ? "Uploading..." : "Upload Image"}
                    </button>
                    <input
                      ref={imageInputRef}
                      type="file"
                      onChange={(e) => uploadFile(e, "image")}
                      accept="image/*"
                      className="hidden"
                    />
                  </div>
                  
                  {form.image && (
                    <div className="mt-3 relative group inline-block">
                      <img
                        src={form.image}
                        alt="Profile preview"
                        className="w-20 h-20 rounded-full object-cover border-2 border-blue-500"
                        onError={handleImageError}
                      />
                      <button
                        onClick={() => setForm({...form, image: ""})}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    CV / Resume
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => cvInputRef.current.click()}
                      disabled={uploading && uploadType === "cv"}
                      className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                    >
                      {uploading && uploadType === "cv" ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Upload className="w-4 h-4" />
                      )}
                      {uploading && uploadType === "cv" ? "Uploading..." : "Upload CV"}
                    </button>
                    <input
                      ref={cvInputRef}
                      type="file"
                      onChange={(e) => uploadFile(e, "cv")}
                      accept=".pdf,.doc,.docx"
                      className="hidden"
                    />
                  </div>
                  
                  {form.cv && (
                    <div className="mt-2">
                      <a
                        href={form.cv}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-500 hover:text-blue-600 flex items-center gap-1"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        View CV
                      </a>
                    </div>
                  )}
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
                  onClick={saveProfile}
                  disabled={loading}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all duration-300 disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  {editingId ? "Update Profile" : "Create Profile"}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Profiles List */}
      {loading && profiles.length === 0 ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        </div>
      ) : profiles.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl">
          <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">No profiles yet</p>
          <button
            onClick={() => setShowForm(true)}
            className="mt-4 text-blue-500 hover:text-blue-600"
          >
            Create your first profile
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {profiles.map((profile) => (
              <motion.div
                key={profile._id}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                whileHover={{ y: -5 }}
                className={`relative group bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden ${
                  profile.isActive ? "ring-2 ring-blue-500" : ""
                }`}
              >
                {/* Active Badge */}
                {profile.isActive && (
                  <div className="absolute top-4 right-4 z-10">
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-500 text-white text-xs rounded-full">
                      <Star className="w-3 h-3" />
                      Active
                    </span>
                  </div>
                )}

                <div className="p-5">
                  {/* Profile Image */}
                  <div className="flex items-center gap-4 mb-4">
                    {profile.image ? (
                      <img
                        src={profile.image}
                        alt={profile.name}
                        className="w-16 h-16 rounded-full object-cover border-2 border-blue-500"
                        onError={handleImageError}
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center border-2 border-blue-500">
                        <User className="w-8 h-8 text-white" />
                      </div>
                    )}
                    <div>
                      <h3 className="font-bold text-lg text-gray-800 dark:text-white">
                        {profile.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {profile.title}
                      </p>
                    </div>
                  </div>

                  {/* Bio Preview */}
                  <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3 mb-4">
                    {profile.bio}
                  </p>
              {profile.cv && (
  <div className="mb-4 p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <FileText className="w-4 h-4 text-blue-500" />
        <span className="text-xs text-gray-600 dark:text-gray-400">CV / Resume</span>
      </div>
      <a
        href={profile.cv}
        target="_blank"
        rel="noopener noreferrer"
        className="text-xs text-blue-500 hover:text-blue-600 flex items-center gap-1"
      >
        <Download className="w-3 h-3" />
        Download
      </a>
    </div>
  </div>
)}
                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-3 border-t border-gray-100 dark:border-gray-700">
                    {!profile.isActive && (
                      <button
                        onClick={() => setActiveProfile(profile._id)}
                        disabled={activeLoading === profile._id}
                        className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm disabled:opacity-50"
                      >
                        {activeLoading === profile._id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Star className="w-4 h-4" />
                        )}
                        Set Active
                      </button>
                    )}
                    <button
                      onClick={() => editProfile(profile)}
                      className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors text-sm"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => deleteProfile(profile._id)}
                      disabled={deleteLoading === profile._id}
                      className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm disabled:opacity-50"
                    >
                      {deleteLoading === profile._id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                      Delete
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}