// pages/Home.jsx - Updated with working solution
import { useEffect, useState } from "react";
import API from "../api/api";
import { TypeAnimation } from "react-type-animation";
import { motion } from "framer-motion";
import { 
  Download, 
  Mail, 
  Github, 
  Linkedin, 
  Twitter,
  MapPin,
  Code2,
  FileText,
  Loader2,
  AlertCircle,
  Eye
} from "lucide-react";

export default function Home({ openLoginModal }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        
        try {
          const profileRes = await API.get("/profile");
          const activeProfile = profileRes.data.find(p => p.isActive);
          setProfile(activeProfile);
          
          if (activeProfile?.cv) {
            console.log("CV URL from backend:", activeProfile.cv);
          }
        } catch (profileError) {
          console.error("Error fetching profile:", profileError);
          setProfile(null);
        }
        
      } catch (error) {
        console.error("Error fetching profile data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfileData();
  }, []);

  // Function to get working Cloudinary PDF URL
  const getCloudinaryWorkingUrl = (url, download = false) => {
    if (!url || !url.includes('cloudinary.com')) return url;
    
    
    if (download && url.includes('/upload/')) {
      return url.replace('/upload/', '/upload/fl_attachment/');
    }
    
    return url;
  };

  // Handle CV Download
  const handleDownloadCV = () => {
    if (!profile?.cv) {
      alert("CV not available");
      return;
    }

    setDownloading(true);
    
    try {
      // Get the URL with fl_attachment for download
      const downloadUrl = getCloudinaryWorkingUrl(profile.cv, true);
      console.log("Download URL:", downloadUrl);
      
      // Open in new tab - this will trigger download
      window.open(downloadUrl, '_blank');
      
    } catch (error) {
      console.error("Download error:", error);
      // Fallback: open the original URL
      window.open(profile.cv, '_blank');
    } finally {
      setTimeout(() => setDownloading(false), 1000);
    }
  };

  // Handle View CV (opens in new tab)
  const handleViewCV = () => {
    if (!profile?.cv) return;
    console.log("View URL:", profile.cv);
    window.open(profile.cv, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mx-auto mb-4"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Code2 className="text-blue-500 text-2xl animate-pulse" />
            </div>
          </div>
          <p className="text-white text-lg mt-4">Loading portfolio...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
        <div className="text-center text-white p-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 max-w-md mx-auto">
            <Code2 className="w-16 h-16 text-blue-400 mx-auto mb-4" />
            <p className="text-xl mb-4">Profile not found</p>
            <p className="text-gray-300 mb-6">Please ensure you have created a profile in the backend</p>
            <button 
              onClick={openLoginModal}
              className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
            >
              Configure Profile
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
   <section className={`min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 relative overflow-hidden 
  pt-20 sm:pt-24 md:pt-28 lg:pt-0`}>
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 backdrop-blur-xl bg-white/10 dark:bg-black/20 border border-white/20 rounded-3xl shadow-2xl p-6 md:p-10 lg:p-12 mx-4 max-w-5xl w-full">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
          
          {/* Profile Image */}
          <div className="relative">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur-2xl opacity-75 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
              <img
                src={profile.image || "https://via.placeholder.com/192"}
                alt={profile.name}
                className="relative w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 rounded-full object-cover border-4 border-white shadow-2xl transform group-hover:scale-105 transition-all duration-300"
                onError={(e) => {
                  e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='192' height='192' viewBox='0 0 24 24' fill='none' stroke='%239ca3af' stroke-width='2'%3E%3Cpath d='M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2'%3E%3C/path%3E%3Ccircle cx='12' cy='7' r='4'%3E%3C/circle%3E%3C/svg%3E";
                }}
              />
            </div>
            <div className="absolute bottom-2 right-2 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse">
              <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-75"></div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 text-center lg:text-left">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3">
              {profile.name}
            </h1>
            
            <div className="flex items-center justify-center lg:justify-start gap-2 mb-4">
              <TypeAnimation
                sequence={[
                  profile.title || "Developer",
                  2000,
                  "Creative Problem Solver",
                  2000,
                  "Tech Enthusiast",
                  2000,
                  "Innovation Seeker",
                  2000
                ]}
                speed={50}
                repeat={Infinity}
                className="text-lg sm:text-xl md:text-2xl text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-300 font-semibold"
              />
            </div>

            {profile.location && (
              <div className="flex items-center justify-center lg:justify-start gap-2 text-gray-200 text-sm mb-4">
                <MapPin className="w-4 h-4 text-blue-400" />
                <span>{profile.location}</span>
              </div>
            )}

            <p className="text-gray-200 text-sm sm:text-base leading-relaxed mb-6 max-w-lg mx-auto lg:mx-0">
              {profile.bio}
            </p>

            {/* CV Buttons */}
            <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
              {profile.cv && profile.cv !== "" ? (
                <>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleDownloadCV}
                    disabled={downloading}
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:shadow-xl transition-all duration-300 disabled:opacity-50"
                  >
                    {downloading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Download className="w-4 h-4" />
                    )}
                    {downloading ? "Processing..." : "Download CV"}
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleViewCV}
                    className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/30 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-white/20 transition-all duration-300"
                  >
                    <Eye className="w-4 h-4" />
                    View CV
                  </motion.button>
                </>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled
                  className="inline-flex items-center gap-2 bg-gray-500 text-white px-6 py-2.5 rounded-xl font-semibold opacity-50 cursor-not-allowed"
                >
                  <FileText className="w-4 h-4" />
                  CV Not Available
                </motion.button>
              )}
              
              {/* Contact Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={openLoginModal}
                className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/30 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-white/20 transition-all duration-300"
              >
                <Mail className="w-4 h-4" />
                Contact Me
              </motion.button>
            </div>

            {/* Info Message */}
            {profile.cv && (
              <p className="mt-3 text-xs text-gray-400 flex items-center justify-center lg:justify-start gap-1">
                <AlertCircle className="w-3 h-3" />
                Click "Download CV" to save, or "View CV" to open in browser
              </p>
            )}

            {/* Social Links */}
            <div className="flex gap-4 justify-center lg:justify-start mt-6">
              {profile.github && (
                <a
                  href={profile.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/10 backdrop-blur-sm p-2 rounded-full hover:bg-white/20 transition-all duration-300"
                >
                  <Github className="w-5 h-5 text-gray-300 hover:text-white" />
                </a>
              )}
              {profile.linkedin && (
                <a
                  href={profile.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/10 backdrop-blur-sm p-2 rounded-full hover:bg-white/20 transition-all duration-300"
                >
                  <Linkedin className="w-5 h-5 text-gray-300 hover:text-white" />
                </a>
              )}
              {profile.twitter && (
                <a
                  href={profile.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/10 backdrop-blur-sm p-2 rounded-full hover:bg-white/20 transition-all duration-300"
                >
                  <Twitter className="w-5 h-5 text-gray-300 hover:text-white" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Skills Section */}
        {profile.skills && profile.skills.length > 0 && (
          <div className="mt-8 pt-6 border-t border-white/20">
            <h3 className="text-white text-sm font-semibold mb-3 text-center lg:text-left">
              Tech Stack & Skills
            </h3>
            <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
              {profile.skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-xs text-gray-200 border border-white/20 hover:bg-white/20 transition-all duration-300"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
      `}</style>
    </section>
  );
}
