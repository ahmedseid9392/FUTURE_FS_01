import { useEffect, useState } from "react";
import API from "../api/api";
import { motion } from "framer-motion";
import { Award, TrendingUp, Star, Code2 } from "lucide-react";

export default function Skills() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

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
      setSkills([]);
    } finally {
      setLoading(false);
    }
  };

  // group by category
  const grouped = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {});

  // Get experience level icon and styles
  const getExperienceStyle = (level) => {
    switch (level) {
      case "Advanced":
        return {
          bg: "bg-green-100 dark:bg-green-900/30",
          text: "text-green-700 dark:text-green-400",
          icon: Award
        };
      case "Intermediate":
        return {
          bg: "bg-yellow-100 dark:bg-yellow-900/30",
          text: "text-yellow-700 dark:text-yellow-400",
          icon: TrendingUp
        };
      default:
        return {
          bg: "bg-blue-100 dark:bg-blue-900/30",
          text: "text-blue-700 dark:text-blue-400",
          icon: Star
        };
    }
  };

  if (loading) {
    return (
      <section id="skills" className="py-20 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
        <div className="container mx-auto px-6 text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading skills...</p>
        </div>
      </section>
    );
  }

  return (
    <section
      id="skills"
      className="py-20 bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 relative overflow-hidden"
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-10 w-72 h-72 bg-blue-400/10 dark:bg-blue-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-purple-400/10 dark:bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-bold text-center mb-4 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent"
        >
          My Skills
        </motion.h2>
        
        <p className="text-center text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto">
          Technologies and tools I work with to bring ideas to life
        </p>

        {/* Categories */}
        {Object.keys(grouped).map((category, categoryIndex) => (
          <motion.div
            key={category}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: categoryIndex * 0.1 }}
            className="mb-12"
          >
            <h3 className="text-2xl font-semibold mb-6 text-blue-600 dark:text-blue-400 border-l-4 border-blue-500 pl-4">
              {category}
            </h3>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {grouped[category].map((skill, skillIndex) => {
                const experienceStyle = getExperienceStyle(skill.experience);
                const ExperienceIcon = experienceStyle.icon;
                
                return (
                  <motion.div
                    key={skill._id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: skillIndex * 0.05 }}
                    whileHover={{ y: -5, scale: 1.02 }}
                    className="group relative bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
                  >
                    {/* Gradient Border Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl blur-sm"></div>
                    
                    {/* Card Content */}
                    <div className="relative bg-white dark:bg-gray-800 rounded-2xl">
                      {/* Skill header */}
                      <div className="flex items-center gap-4 mb-3">
                        <div className="relative">
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl blur opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                          {skill.icon ? (
                            <img
                              src={skill.icon}
                              alt={skill.name}
                              className="relative w-14 h-14 object-contain rounded-xl bg-gray-100 dark:bg-gray-700 p-2 group-hover:scale-110 transition-transform duration-300"
                              onError={(e) => {
                                e.target.src = "https://via.placeholder.com/56?text=Skill";
                              }}
                            />
                          ) : (
                            <div className="relative w-14 h-14 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                              <Code2 className="w-7 h-7 text-white" />
                            </div>
                          )}
                        </div>

                        <h4 className="text-lg font-bold text-gray-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {skill.name}
                        </h4>
                      </div>

                      {/* description */}
                      {skill.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                          {skill.description}
                        </p>
                      )}

                      {/* experience badge */}
                      {skill.experience && (
                        <div className={`inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full font-semibold ${experienceStyle.bg} ${experienceStyle.text}`}>
                          <ExperienceIcon className="w-3.5 h-3.5" />
                          <span>{skill.experience}</span>
                        </div>
                      )}

                      {/* Optional: Proficiency Bar */}
                      {skill.proficiency && (
                        <div className="mt-4">
                          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                            <span>Proficiency</span>
                            <span>{skill.proficiency}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              whileInView={{ width: `${skill.proficiency}%` }}
                              transition={{ duration: 1, delay: 0.2 }}
                              className={`h-full rounded-full bg-gradient-to-r ${
                                skill.experience === "Advanced" 
                                  ? "from-green-500 to-emerald-500"
                                  : skill.experience === "Intermediate"
                                  ? "from-yellow-500 to-orange-500"
                                  : "from-blue-500 to-cyan-500"
                              }`}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        ))}

        {/* Empty State */}
        {Object.keys(grouped).length === 0 && !loading && (
          <div className="text-center py-12">
            <Code2 className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">No skills available at the moment.</p>
          </div>
        )}
      </div>
    </section>
  );
}