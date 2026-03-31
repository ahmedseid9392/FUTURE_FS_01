import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Save, 
  Edit, 
  Trash2, 
  Plus, 
  X,
  CheckCircle,
  AlertCircle,
  Loader2,
  BookOpen,
  Briefcase,
  FileText,
  GraduationCap,
  Building,
  Calendar,
  MessageSquare
} from "lucide-react";
import API from "../../api/api";

export default function AboutAdmin() {
  const [about, setAbout] = useState(null);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  // Education state
  const [edu, setEdu] = useState({
    title: "",
    school: "",
    year: "",
    description: ""
  });
  const [editingEdu, setEditingEdu] = useState(null);
  const [eduLoading, setEduLoading] = useState(false);
  const [deleteEduLoading, setDeleteEduLoading] = useState(null);

  // Experience state
  const [exp, setExp] = useState({
    role: "",
    company: "",
    year: "",
    description: ""
  });
  const [editingExp, setEditingExp] = useState(null);
  const [expLoading, setExpLoading] = useState(false);
  const [deleteExpLoading, setDeleteExpLoading] = useState(null);

  useEffect(() => { 
    fetchAbout(); 
  }, []);

  const fetchAbout = async () => {
    setLoading(true);
    try {
      const res = await API.get("/about");
      setAbout(res.data);
      setText(res.data.aboutText || "");
    } catch (err) {
      console.error("Error fetching about data:", err);
      showNotification("Failed to load about information", "error");
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // ABOUT TEXT
  const saveAbout = async () => {
    if (!text.trim()) {
      showNotification("About text cannot be empty", "error");
      return;
    }

    setLoading(true);
    try {
      await API.put("/about", { aboutText: text });
      showNotification("About text updated successfully", "success");
      fetchAbout();
    } catch (err) {
      console.error("Error saving about text:", err);
      showNotification("Failed to save about text", "error");
    } finally {
      setLoading(false);
    }
  };

  // EDUCATION
  const saveEdu = async () => {
    if (!edu.title.trim() || !edu.school.trim() || !edu.year.trim()) {
      showNotification("Please fill all required fields (Title, School, Year)", "error");
      return;
    }

    setEduLoading(true);
    try {
      if (editingEdu) {
        await API.put(`/about/education/${editingEdu}`, edu);
        showNotification("Education updated successfully", "success");
      } else {
        await API.post("/about/education", edu);
        showNotification("Education added successfully", "success");
      }

      setEdu({ title: "", school: "", year: "", description: "" });
      setEditingEdu(null);
      fetchAbout();
    } catch (err) {
      console.error("Error saving education:", err);
      showNotification("Failed to save education", "error");
    } finally {
      setEduLoading(false);
    }
  };

  const editEdu = (e) => {
    setEdu(e);
    setEditingEdu(e._id);
    window.scrollTo({ top: 400, behavior: "smooth" });
  };

  const deleteEdu = async (id) => {
    if (!window.confirm("Are you sure you want to delete this education entry?")) {
      return;
    }

    setDeleteEduLoading(id);
    try {
      await API.delete(`/about/education/${id}`);
      showNotification("Education deleted successfully", "success");
      fetchAbout();
    } catch (err) {
      console.error("Error deleting education:", err);
      showNotification("Failed to delete education", "error");
    } finally {
      setDeleteEduLoading(null);
    }
  };

  // EXPERIENCE
  const saveExp = async () => {
    if (!exp.role.trim() || !exp.company.trim() || !exp.year.trim()) {
      showNotification("Please fill all required fields (Role, Company, Year)", "error");
      return;
    }

    setExpLoading(true);
    try {
      if (editingExp) {
        await API.put(`/about/experience/${editingExp}`, exp);
        showNotification("Experience updated successfully", "success");
      } else {
        await API.post("/about/experience", exp);
        showNotification("Experience added successfully", "success");
      }

      setExp({ role: "", company: "", year: "", description: "" });
      setEditingExp(null);
      fetchAbout();
    } catch (err) {
      console.error("Error saving experience:", err);
      showNotification("Failed to save experience", "error");
    } finally {
      setExpLoading(false);
    }
  };

  const editExp = (e) => {
    setExp(e);
    setEditingExp(e._id);
    window.scrollTo({ top: 800, behavior: "smooth" });
  };

  const deleteExp = async (id) => {
    if (!window.confirm("Are you sure you want to delete this experience entry?")) {
      return;
    }

    setDeleteExpLoading(id);
    try {
      await API.delete(`/about/experience/${id}`);
      showNotification("Experience deleted successfully", "success");
      fetchAbout();
    } catch (err) {
      console.error("Error deleting experience:", err);
      showNotification("Failed to delete experience", "error");
    } finally {
      setDeleteExpLoading(null);
    }
  };

  const cancelEduEdit = () => {
    setEdu({ title: "", school: "", year: "", description: "" });
    setEditingEdu(null);
  };

  const cancelExpEdit = () => {
    setExp({ role: "", company: "", year: "", description: "" });
    setEditingExp(null);
  };

  if (!about && loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!about) return null;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
          About Management
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
          Manage your about section content, education, and experience
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

      {/* ABOUT TEXT SECTION */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700"
      >
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
              About Text
            </h3>
          </div>
          
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows="6"
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            placeholder="Write about yourself..."
          />
          
          <div className="flex justify-end mt-4">
            <button
              onClick={saveAbout}
              disabled={loading}
              className="inline-flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all duration-300 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              Save About Text
            </button>
          </div>
        </div>
      </motion.div>

      {/* EDUCATION SECTION */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <GraduationCap className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                Education
              </h3>
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {about.education?.length || 0} entries
            </span>
          </div>

          {/* Education Form */}
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium text-gray-700 dark:text-gray-300">
                {editingEdu ? "Edit Education" : "Add New Education"}
              </h4>
              {editingEdu && (
                <button
                  onClick={cancelEduEdit}
                  className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400"
                >
                  Cancel Edit
                </button>
              )}
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <input
                placeholder="Degree / Title *"
                value={edu.title}
                onChange={(e) => setEdu({...edu, title: e.target.value})}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <input
                placeholder="School / Institution *"
                value={edu.school}
                onChange={(e) => setEdu({...edu, school: e.target.value})}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <input
                placeholder="Year (e.g., 2020-2024) *"
                value={edu.year}
                onChange={(e) => setEdu({...edu, year: e.target.value})}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <input
                placeholder="Description (optional)"
                value={edu.description}
                onChange={(e) => setEdu({...edu, description: e.target.value})}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            
            <div className="flex justify-end mt-4">
              <button
                onClick={saveEdu}
                disabled={eduLoading}
                className="inline-flex items-center gap-2 px-5 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
              >
                {eduLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Plus className="w-4 h-4" />
                )}
                {editingEdu ? "Update Education" : "Add Education"}
              </button>
            </div>
          </div>

          {/* Education List */}
          <div className="space-y-3">
            {about.education && about.education.length > 0 ? (
              about.education.map((e) => (
                <motion.div
                  key={e._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <GraduationCap className="w-4 h-4 text-green-500" />
                      <p className="font-semibold text-gray-800 dark:text-white">
                        {e.title}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Building className="w-3 h-3" />
                      <span>{e.school}</span>
                      <Calendar className="w-3 h-3 ml-2" />
                      <span>{e.year}</span>
                    </div>
                    {e.description && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {e.description}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => editEdu(e)}
                      className="p-2 text-yellow-600 hover:bg-yellow-100 dark:hover:bg-yellow-900/30 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteEdu(e._id)}
                      disabled={deleteEduLoading === e._id}
                      className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors disabled:opacity-50"
                      title="Delete"
                    >
                      {deleteEduLoading === e._id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <GraduationCap className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No education entries yet</p>
                <p className="text-sm">Add your first education using the form above</p>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* EXPERIENCE SECTION */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <Briefcase className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                Experience
              </h3>
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {about.experience?.length || 0} entries
            </span>
          </div>

          {/* Experience Form */}
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium text-gray-700 dark:text-gray-300">
                {editingExp ? "Edit Experience" : "Add New Experience"}
              </h4>
              {editingExp && (
                <button
                  onClick={cancelExpEdit}
                  className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400"
                >
                  Cancel Edit
                </button>
              )}
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <input
                placeholder="Role / Position *"
                value={exp.role}
                onChange={(e) => setExp({...exp, role: e.target.value})}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <input
                placeholder="Company *"
                value={exp.company}
                onChange={(e) => setExp({...exp, company: e.target.value})}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <input
                placeholder="Year (e.g., 2022-Present) *"
                value={exp.year}
                onChange={(e) => setExp({...exp, year: e.target.value})}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <input
                placeholder="Description (optional)"
                value={exp.description}
                onChange={(e) => setExp({...exp, description: e.target.value})}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            
            <div className="flex justify-end mt-4">
              <button
                onClick={saveExp}
                disabled={expLoading}
                className="inline-flex items-center gap-2 px-5 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors disabled:opacity-50"
              >
                {expLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Plus className="w-4 h-4" />
                )}
                {editingExp ? "Update Experience" : "Add Experience"}
              </button>
            </div>
          </div>

          {/* Experience List */}
          <div className="space-y-3">
            {about.experience && about.experience.length > 0 ? (
              about.experience.map((e) => (
                <motion.div
                  key={e._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Briefcase className="w-4 h-4 text-purple-500" />
                      <p className="font-semibold text-gray-800 dark:text-white">
                        {e.role}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Building className="w-3 h-3" />
                      <span>{e.company}</span>
                      <Calendar className="w-3 h-3 ml-2" />
                      <span>{e.year}</span>
                    </div>
                    {e.description && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {e.description}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => editExp(e)}
                      className="p-2 text-yellow-600 hover:bg-yellow-100 dark:hover:bg-yellow-900/30 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteExp(e._id)}
                      disabled={deleteExpLoading === e._id}
                      className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors disabled:opacity-50"
                      title="Delete"
                    >
                      {deleteExpLoading === e._id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <Briefcase className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No experience entries yet</p>
                <p className="text-sm">Add your first experience using the form above</p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}