import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  Upload, 
  Image as ImageIcon,
  AlertCircle,
  CheckCircle,
  Loader2,
  Code2,
  Database,
  Layout,
  Wrench,
  Star,
  TrendingUp,
  Award
} from "lucide-react";
import API from "../../api/api";

export default function SkillsAdmin() {
  const [skills, setSkills] = useState([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    icon: "",
    category: "Frontend",
    experience: "Intermediate",
    proficiency: 70
  });
  const [editingId, setEditingId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [notification, setNotification] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    setLoading(true);
    try {
      const res = await API.get("/skills");
      setSkills(res.data || []);
    } catch (err) {
      console.error("Error fetching skills:", err);
      showNotification("Failed to load skills", "error");
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Upload icon to Cloudinary
  const uploadIcon = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      showNotification("Please upload an image file", "error");
      return;
    }

    // Validate file size (max 2MB for icons)
    if (file.size > 2 * 1024 * 1024) {
      showNotification("Icon size should be less than 2MB", "error");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await API.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setForm(prev => ({
        ...prev,
        icon: res.data.imageUrl
      }));
      showNotification("Icon uploaded successfully", "success");
    } catch (err) {
      console.error("Upload error:", err);
      showNotification("Failed to upload icon", "error");
    } finally {
      setUploading(false);
    }
  };

  // Add or Update skill
  const saveSkill = async () => {
    // Validate form
    if (!form.name.trim()) {
      showNotification("Skill name is required", "error");
      return;
    }
    if (!form.description.trim()) {
      showNotification("Skill description is required", "error");
      return;
    }
    if (!form.icon) {
      showNotification("Please upload an icon for the skill", "error");
      return;
    }

    setLoading(true);
    try {
      if (editingId) {
        await API.put(`/skills/${editingId}`, form);
        showNotification("Skill updated successfully", "success");
      } else {
        await API.post("/skills", form);
        showNotification("Skill added successfully", "success");
      }

      // Reset form
      setForm({
        name: "",
        description: "",
        icon: "",
        category: "Frontend",
        experience: "Intermediate",
        proficiency: 70
      });
      setEditingId(null);
      setShowForm(false);
      fetchSkills();
    } catch (err) {
      console.error("Save error:", err);
      showNotification("Failed to save skill", "error");
    } finally {
      setLoading(false);
    }
  };

  // Edit skill
  const editSkill = (skill) => {
    setForm({
      name: skill.name,
      description: skill.description,
      icon: skill.icon,
      category: skill.category,
      experience: skill.experience,
      proficiency: skill.proficiency || 70
    });
    setEditingId(skill._id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Delete skill
  const deleteSkill = async (id) => {
    if (!window.confirm("Are you sure you want to delete this skill? This action cannot be undone.")) {
      return;
    }

    setDeleteLoading(id);
    try {
      await API.delete(`/skills/${id}`);
      showNotification("Skill deleted successfully", "success");
      fetchSkills();
    } catch (err) {
      console.error("Delete error:", err);
      showNotification("Failed to delete skill", "error");
    } finally {
      setDeleteLoading(null);
    }
  };

  const cancelEdit = () => {
    setForm({
      name: "",
      description: "",
      icon: "",
      category: "Frontend",
      experience: "Intermediate",
      proficiency: 70
    });
    setEditingId(null);
    setShowForm(false);
  };

  // Category options with icons
  const categories = [
    { value: "Frontend", label: "Frontend", icon: Layout },
    { value: "Backend", label: "Backend", icon: Code2 },
    { value: "Database", label: "Database", icon: Database },
    { value: "Tools", label: "Tools", icon: Wrench }
  ];

  // Experience levels
  const experienceLevels = [
    { value: "Beginner", label: "Beginner", icon: Star, color: "from-blue-500 to-cyan-500" },
    { value: "Intermediate", label: "Intermediate", icon: TrendingUp, color: "from-yellow-500 to-orange-500" },
    { value: "Advanced", label: "Advanced", icon: Award, color: "from-green-500 to-emerald-500" }
  ];

  const getExperienceConfig = (level) => {
    return experienceLevels.find(l => l.value === level) || experienceLevels[1];
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
            Manage Skills
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
            Add, edit, or remove your technical skills
          </p>
        </div>
        
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all duration-300"
        >
          {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showForm ? "Cancel" : "Add New Skill"}
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
                  {editingId ? "Edit Skill" : "Add New Skill"}
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

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Skill Name *
                    </label>
                    <input
                      value={form.name}
                      onChange={(e) => setForm({...form, name: e.target.value})}
                      placeholder="e.g., React.js"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Description *
                    </label>
                    <textarea
                      value={form.description}
                      onChange={(e) => setForm({...form, description: e.target.value})}
                      placeholder="Describe your proficiency with this skill..."
                      rows="3"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Category *
                    </label>
                    <select
                      value={form.category}
                      onChange={(e) => setForm({...form, category: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {categories.map(cat => (
                        <option key={cat.value} value={cat.value}>{cat.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Experience Level *
                    </label>
                    <select
                      value={form.experience}
                      onChange={(e) => setForm({...form, experience: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {experienceLevels.map(level => (
                        <option key={level.value} value={level.value}>{level.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Proficiency (%) (Optional)
                    </label>
                    <input
                      type="range"
                      value={form.proficiency}
                      onChange={(e) => setForm({...form, proficiency: parseInt(e.target.value)})}
                      min="0"
                      max="100"
                      className="w-full"
                    />
                    <div className="text-center text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {form.proficiency}%
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Skill Icon *
                    </label>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current.click()}
                        disabled={uploading}
                        className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                      >
                        {uploading ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Upload className="w-4 h-4" />
                        )}
                        {uploading ? "Uploading..." : "Upload Icon"}
                      </button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        onChange={uploadIcon}
                        accept="image/*"
                        className="hidden"
                      />
                    </div>
                    
                    {form.icon && (
                      <div className="mt-3 relative group inline-block">
                        <img
                          src={form.icon}
                          alt="Icon preview"
                          className="w-16 h-16 object-contain rounded-lg border border-gray-200 dark:border-gray-700 p-2 bg-gray-50 dark:bg-gray-900"
                        />
                        <button
                          onClick={() => setForm({...form, icon: ""})}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
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
                  onClick={saveSkill}
                  disabled={loading || uploading}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all duration-300 disabled:opacity-50"
                >
                  {(loading || uploading) ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  {editingId ? "Update Skill" : "Add Skill"}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Skills Grid */}
      {loading && skills.length === 0 ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        </div>
      ) : skills.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl">
          <Code2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">No skills yet</p>
          <button
            onClick={() => setShowForm(true)}
            className="mt-4 text-blue-500 hover:text-blue-600"
          >
            Add your first skill
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {skills.map((skill) => {
              const experienceConfig = getExperienceConfig(skill.experience);
              const ExperienceIcon = experienceConfig.icon;
              const CategoryIcon = categories.find(c => c.value === skill.category)?.icon || Code2;
              
              return (
                <motion.div
                  key={skill._id}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  whileHover={{ y: -5 }}
                  className="group bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
                >
                  <div className="p-5">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="relative">
                        {skill.icon ? (
                          <img
                            src={skill.icon}
                            alt={skill.name}
                            className="w-12 h-12 object-contain rounded-lg bg-gray-100 dark:bg-gray-700 p-2"
                            onError={(e) => {
                              e.target.src = "https://via.placeholder.com/48?text=Icon";
                            }}
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                            <Code2 className="w-6 h-6 text-white" />
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="font-bold text-lg text-gray-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {skill.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <CategoryIcon className="w-3 h-3 text-gray-400" />
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {skill.category}
                          </span>
                        </div>
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                      {skill.description}
                    </p>

                    <div className="flex items-center justify-between mb-4">
                      <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${experienceConfig.color.includes('green') ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : experienceConfig.color.includes('yellow') ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400' : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'}`}>
                        <ExperienceIcon className="w-3 h-3" />
                        <span>{skill.experience}</span>
                      </div>
                    </div>

                    {/* Proficiency Bar */}
                    {skill.proficiency && (
                      <div className="mb-4">
                        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                          <span>Proficiency</span>
                          <span>{skill.proficiency}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${skill.proficiency}%` }}
                            transition={{ duration: 1 }}
                            className={`h-full rounded-full bg-gradient-to-r ${experienceConfig.color}`}
                          />
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2 pt-3 border-t border-gray-100 dark:border-gray-700">
                      <button
                        onClick={() => editSkill(skill)}
                        className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors text-sm"
                      >
                        <Edit className="w-4 h-4" />
                        Edit
                      </button>
                      <button
                        onClick={() => deleteSkill(skill._id)}
                        disabled={deleteLoading === skill._id}
                        className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm disabled:opacity-50"
                      >
                        {deleteLoading === skill._id ? (
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