import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  FolderGit2, 
  Code2, 
  Mail, 
  Users, 
  TrendingUp,
  MessageSquare,
  CheckCircle,
  Clock,
  User,
  ArrowUp,
  ArrowDown
} from "lucide-react";
import API from "../../api/api";
import {
  LineChart,
  Line,
 PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

export default function Overview() {
  const [stats, setStats] = useState({
    projects: 0,
    skills: 0,
    messages: 0,
    unreadMessages: 0,
    profiles: 0,
    activeProfile: null,
    socialLinks: 0
  });
  const [recentMessages, setRecentMessages] = useState([]);
  const [recentProjects, setRecentProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState([]);
  const [visitorData, setVisitorData] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch all data in parallel
      const [projectsRes, skillsRes, messagesRes, profilesRes, socialsRes] = await Promise.all([
        API.get("/projects"),
        API.get("/skills"),
        API.get("/contact"),
        API.get("/profile"),
        API.get("/socials")
      ]);

      const projects = projectsRes.data || [];
      const skills = skillsRes.data || [];
      const messages = messagesRes.data || [];
      const profiles = profilesRes.data || [];
      const socials = socialsRes.data || [];

      const unreadMessages = messages.filter(m => m.status === "unread").length;
      const activeProfile = profiles.find(p => p.isActive);

      setStats({
        projects: projects.length,
        skills: skills.length,
        messages: messages.length,
        unreadMessages: unreadMessages,
        profiles: profiles.length,
        activeProfile: activeProfile,
        socialLinks: socials.length
      });

      // Set recent messages (last 5)
      setRecentMessages(messages.slice(0, 5));

      // Set recent projects (last 5)
      setRecentProjects(projects.slice(0, 5));

      // Generate chart data (example - you can replace with actual analytics data)
      const mockChartData = [
        { month: "Jan", projects: 2, messages: 5, skills: 3 },
        { month: "Feb", projects: 3, messages: 8, skills: 4 },
        { month: "Mar", projects: 4, messages: 12, skills: 5 },
        { month: "Apr", projects: 5, messages: 15, skills: 6 },
        { month: "May", projects: 7, messages: 18, skills: 7 },
        { month: "Jun", projects: 9, messages: 22, skills: 8 }
      ];
      setChartData(mockChartData);

      // Visitor data (example)
      const mockVisitorData = [
        { day: "Mon", visitors: 120 },
        { day: "Tue", visitors: 150 },
        { day: "Wed", visitors: 180 },
        { day: "Thu", visitors: 220 },
        { day: "Fri", visitors: 280 },
        { day: "Sat", visitors: 200 },
        { day: "Sun", visitors: 160 }
      ];
      setVisitorData(mockVisitorData);

    } catch (err) {
      console.error("Error fetching dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  // Color schemes for charts
  const COLORS = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444'];

  const statCards = [
    {
      title: "Total Projects",
      value: stats.projects,
      icon: FolderGit2,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900/30",
      textColor: "text-blue-600 dark:text-blue-400"
    },
    {
      title: "Skills",
      value: stats.skills,
      icon: Code2,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-900/30",
      textColor: "text-purple-600 dark:text-purple-400"
    },
    {
      title: "Total Messages",
      value: stats.messages,
      icon: Mail,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-100 dark:bg-green-900/30",
      textColor: "text-green-600 dark:text-green-400"
    },
    {
      title: "Unread Messages",
      value: stats.unreadMessages,
      icon: MessageSquare,
      color: "from-red-500 to-red-600",
      bgColor: "bg-red-100 dark:bg-red-900/30",
      textColor: "text-red-600 dark:text-red-400"
    },
    {
      title: "Social Links",
      value: stats.socialLinks,
      icon: Users,
      color: "from-yellow-500 to-yellow-600",
      bgColor: "bg-yellow-100 dark:bg-yellow-900/30",
      textColor: "text-yellow-600 dark:text-yellow-400"
    },
    {
      title: "Active Profile",
      value: stats.activeProfile ? 1 : 0,
      icon: User,
      color: "from-indigo-500 to-indigo-600",
      bgColor: "bg-indigo-100 dark:bg-indigo-900/30",
      textColor: "text-indigo-600 dark:text-indigo-400",
      subtitle: stats.activeProfile?.name || "No active profile"
    }
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
          Dashboard Overview
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
          Welcome back! Here's what's happening with your portfolio today.
        </p>
      </div>

      {/* Stats Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4"
      >
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={index}
              variants={cardVariants}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
            >
              <div className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`w-5 h-5 ${stat.textColor}`} />
                  </div>
                  <TrendingUp className="w-4 h-4 text-green-500" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
                  {stat.value}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {stat.title}
                </p>
                {stat.subtitle && (
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-2 truncate">
                    {stat.subtitle}
                  </p>
                )}
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Activity Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
              Monthly Activity
            </h3>
            <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
              <ArrowUp className="w-4 h-4" />
              <span>+23%</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="month" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#F3F4F6'
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="projects" 
                stroke="#3B82F6" 
                strokeWidth={2}
                dot={{ fill: '#3B82F6' }}
              />
              <Line 
                type="monotone" 
                dataKey="messages" 
                stroke="#10B981" 
                strokeWidth={2}
                dot={{ fill: '#10B981' }}
              />
              <Line 
                type="monotone" 
                dataKey="skills" 
                stroke="#8B5CF6" 
                strokeWidth={2}
                dot={{ fill: '#8B5CF6' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Visitor Chart */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
              Weekly Visitors
            </h3>
            <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
              <ArrowDown className="w-4 h-4" />
              <span>-5%</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={visitorData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="day" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#F3F4F6'
                }}
              />
              <Area 
                type="monotone" 
                dataKey="visitors" 
                stroke="#3B82F6" 
                fill="url(#colorVisitors)" 
                strokeWidth={2}
              />
              <defs>
                <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                </linearGradient>
              </defs>
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Distribution Chart */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Skills Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
        >
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            Skills Distribution
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={[
                  { name: "Frontend", value: stats.skills * 0.4 },
                  { name: "Backend", value: stats.skills * 0.35 },
                  { name: "Database", value: stats.skills * 0.15 },
                  { name: "Tools", value: stats.skills * 0.1 }
                ]}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {stats.skills > 0 && (
                  COLORS.map((color, index) => (
                    <Cell key={`cell-${index}`} fill={color} />
                  ))
                )}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Messages Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
        >
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            Messages Status
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={[
                  { name: "Read", value: stats.messages - stats.unreadMessages },
                  { name: "Unread", value: stats.unreadMessages }
                ]}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                <Cell fill="#10B981" />
                <Cell fill="#EF4444" />
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Recent Activity Section */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Messages */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
        >
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                Recent Messages
              </h3>
              <Mail className="w-5 h-5 text-gray-400" />
            </div>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {recentMessages.length > 0 ? (
              recentMessages.map((message, index) => (
                <div key={index} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-gray-800 dark:text-white">
                        {message.name}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {message.subject}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${
                          message.status === "unread"
                            ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                            : "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                        }`}>
                          {message.status === "unread" ? (
                            <Clock className="w-3 h-3" />
                          ) : (
                            <CheckCircle className="w-3 h-3" />
                          )}
                          {message.status}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(message.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                <Mail className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No messages yet</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Recent Projects */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
        >
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                Recent Projects
              </h3>
              <FolderGit2 className="w-5 h-5 text-gray-400" />
            </div>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {recentProjects.length > 0 ? (
              recentProjects.map((project, index) => (
                <div key={index} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <div className="flex items-start gap-3">
                    {project.image && (
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-12 h-12 rounded-lg object-cover"
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/48?text=Project";
                        }}
                      />
                    )}
                    <div className="flex-1">
                      <p className="font-medium text-gray-800 dark:text-white">
                        {project.title}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1">
                        {project.description}
                      </p>
                      <div className="flex gap-2 mt-2">
                        {project.github && (
                          <a
                            href={project.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-500 hover:text-blue-600"
                          >
                            GitHub
                          </a>
                        )}
                        {project.demo && (
                          <a
                            href={project.demo}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-green-500 hover:text-green-600"
                          >
                            Live Demo
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                <FolderGit2 className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No projects yet</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg p-6"
      >
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-white mb-2">
              Quick Actions
            </h3>
            <p className="text-blue-100">
              Manage your portfolio content efficiently
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => window.location.href = "/admin/projects"}
              className="px-4 py-2 bg-white text-blue-600 rounded-lg font-medium hover:shadow-lg transition-all"
            >
              Add Project
            </button>
            <button
              onClick={() => window.location.href = "/admin/skills"}
              className="px-4 py-2 bg-white/20 text-white rounded-lg font-medium hover:bg-white/30 transition-all"
            >
              Add Skill
            </button>
            <button
              onClick={() => window.location.href = "/admin/messages"}
              className="px-4 py-2 bg-white/20 text-white rounded-lg font-medium hover:bg-white/30 transition-all"
            >
              View Messages
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}