import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Mail, 
  User, 
  Calendar, 
  Trash2, 
  CheckCircle, 
  X,
  Send,
  AlertCircle,
  CheckCircle as SuccessIcon,
  Loader2,
  Inbox,
  MessageSquare,
  Eye
} from "lucide-react";
import API from "../../api/api";

export default function ContactAdmin() {
  const [messages, setMessages] = useState([]);
  const [selected, setSelected] = useState(null);
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [notification, setNotification] = useState(null);
  const [filter, setFilter] = useState("all");
  const modalRef = useRef(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await API.get("/contact");
      setMessages(res.data || []);
    } catch (err) {
      console.error("Error fetching messages:", err);
      showNotification("Failed to load messages", "error");
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const markRead = async (id) => {
    try {
      await API.put(`/contact/read/${id}`);
      fetchMessages();
      showNotification("Message marked as read", "success");
    } catch (err) {
      console.error("Error marking as read:", err);
      showNotification("Failed to mark as read", "error");
    }
  };

  const deleteMessage = async (id) => {
    if (!window.confirm("Are you sure you want to delete this message? This action cannot be undone.")) {
      return;
    }

    setDeleteLoading(id);
    try {
      await API.delete(`/contact/${id}`);
      fetchMessages();
      showNotification("Message deleted successfully", "success");
      
      if (selected?._id === id) {
        setSelected(null);
      }
    } catch (err) {
      console.error("Error deleting message:", err);
      showNotification("Failed to delete message", "error");
    } finally {
      setDeleteLoading(null);
    }
  };

  const sendReply = async () => {
    if (!reply.trim()) {
      showNotification("Please enter a reply message", "error");
      return;
    }

    setSending(true);
    try {
      await API.post("/contact/reply", {
        email: selected.email,
        reply: reply
      });
      
      showNotification("Reply sent successfully!", "success");
      setReply("");
      setSelected(null);
      
      // Optional: Mark message as read after replying
      if (selected.status === "unread") {
        await API.put(`/contact/read/${selected._id}`);
        fetchMessages();
      }
    } catch (err) {
      console.error("Error sending reply:", err);
      showNotification("Failed to send reply", "error");
    } finally {
      setSending(false);
    }
  };

  // Filter messages
  const filteredMessages = messages.filter(msg => {
    if (filter === "all") return true;
    if (filter === "unread") return msg.status === "unread";
    if (filter === "read") return msg.status === "read";
    return true;
  });

  const unreadCount = messages.filter(msg => msg.status === "unread").length;
  const readCount = messages.filter(msg => msg.status === "read").length;

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return "Today";
    } else if (diffDays === 1) {
      return "Yesterday";
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  // Animation variants
  const modalVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.2 }
    },
    exit: { 
      opacity: 0, 
      scale: 0.9,
      transition: { duration: 0.2 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, x: -20 }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
            Contact Messages
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
            Manage and respond to messages from your portfolio visitors
          </p>
        </div>
        
        <div className="flex gap-2">
          <div className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <Mail className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Total: {messages.length}
            </span>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <MessageSquare className="w-4 h-4 text-red-500" />
            <span className="text-sm font-medium text-red-600 dark:text-red-400">
              Unread: {unreadCount}
            </span>
          </div>
        </div>
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
              <SuccessIcon className="w-4 h-4" />
            )}
            <span className="text-sm">{notification.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 text-sm font-medium transition-colors relative ${
            filter === "all"
              ? "text-blue-600 dark:text-blue-400"
              : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          }`}
        >
          All Messages
          {filter === "all" && (
            <motion.div
              layoutId="activeTab"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"
            />
          )}
        </button>
        <button
          onClick={() => setFilter("unread")}
          className={`px-4 py-2 text-sm font-medium transition-colors relative ${
            filter === "unread"
              ? "text-blue-600 dark:text-blue-400"
              : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          }`}
        >
          Unread ({unreadCount})
          {filter === "unread" && (
            <motion.div
              layoutId="activeTab"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"
            />
          )}
        </button>
        <button
          onClick={() => setFilter("read")}
          className={`px-4 py-2 text-sm font-medium transition-colors relative ${
            filter === "read"
              ? "text-blue-600 dark:text-blue-400"
              : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          }`}
        >
          Read ({readCount})
          {filter === "read" && (
            <motion.div
              layoutId="activeTab"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"
            />
          )}
        </button>
      </div>

      {/* Messages Grid */}
      {loading && messages.length === 0 ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        </div>
      ) : filteredMessages.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl">
          <Inbox className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">
            {filter === "unread" 
              ? "No unread messages" 
              : filter === "read" 
              ? "No read messages" 
              : "No messages yet"}
          </p>
          {filter !== "all" && (
            <button
              onClick={() => setFilter("all")}
              className="mt-4 text-blue-500 hover:text-blue-600"
            >
              View all messages
            </button>
          )}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredMessages.map((msg) => (
              <motion.div
                key={msg._id}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                whileHover={{ y: -5 }}
                className={`group cursor-pointer rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden ${
                  msg.status === "unread" 
                    ? "bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-l-4 border-l-blue-500" 
                    : "bg-white dark:bg-gray-800"
                }`}
                onClick={() => setSelected(msg)}
              >
                <div className="p-5">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-800 dark:text-white flex items-center gap-2">
                        {msg.name}
                        {msg.status === "unread" && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
                            <Eye className="w-3 h-3" />
                            New
                          </span>
                        )}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Mail className="w-3 h-3 text-gray-400" />
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {msg.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(msg.createdAt)}</span>
                    </div>
                  </div>

                  {/* Subject */}
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {msg.subject}
                  </p>

                  {/* Message Preview */}
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-4">
                    {msg.message}
                  </p>

                  {/* Status Badge */}
                  <div className="flex items-center justify-between">
                    <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
                      msg.status === "unread"
                        ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                        : "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                    }`}>
                      {msg.status === "unread" ? (
                        <AlertCircle className="w-3 h-3" />
                      ) : (
                        <CheckCircle className="w-3 h-3" />
                      )}
                      {msg.status === "unread" ? "Unread" : "Read"}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
                    {msg.status === "unread" && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          markRead(msg._id);
                        }}
                        className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-xs"
                      >
                        <CheckCircle className="w-3 h-3" />
                        Mark Read
                      </button>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteMessage(msg._id);
                      }}
                      disabled={deleteLoading === msg._id}
                      className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-xs disabled:opacity-50"
                    >
                      {deleteLoading === msg._id ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <Trash2 className="w-3 h-3" />
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

      {/* Message Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setSelected(null)}
          >
            <motion.div
              ref={modalRef}
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                    {selected.subject}
                  </h3>
                  <button
                    onClick={() => setSelected(null)}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="px-6 py-4 space-y-4">
                {/* Sender Info */}
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <User className="w-5 h-5 text-blue-500" />
                    <div>
                      <p className="font-medium text-gray-800 dark:text-white">{selected.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{selected.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(selected.createdAt).toLocaleString()}</span>
                  </div>
                </div>

                {/* Message Body */}
                <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                    {selected.message}
                  </p>
                </div>

                {/* Reply Section */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Write a Reply
                  </label>
                  <textarea
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    placeholder="Type your reply here..."
                    rows="4"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Your reply will be sent to {selected.email}
                  </p>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="sticky bottom-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-6 py-4">
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setSelected(null)}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={sendReply}
                    disabled={sending || !reply.trim()}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all duration-300 disabled:opacity-50"
                  >
                    {sending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                    Send Reply
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}