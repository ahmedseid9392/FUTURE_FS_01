import { useEffect, useState } from "react";
import { motion, useAnimation, useInView } from "framer-motion";
import { useRef } from "react";
import API from "../api/api";
import { 
  Heart, 
  ArrowUp, 
  Github, 
  Linkedin, 
  Twitter, 
  Mail,
  Instagram,
  Facebook,
  Youtube
} from "lucide-react";

export default function Footer() {
  const [socials, setSocials] = useState([]);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const footerRef = useRef(null);
  const isInView = useInView(footerRef, { once: true });
  const controls = useAnimation();

  useEffect(() => {
    const fetchSocials = async () => {
      try {
        const res = await API.get("/socials");
        setSocials(res.data || []);
      } catch (error) {
        console.error("Error fetching social links:", error);
        setSocials([]); // Fallback to empty array
      }
    };
    
    fetchSocials();
  }, []);

  // Handle scroll to top button visibility
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Animation when footer comes into view
  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  // Map icon names to Lucide components
  const getIconComponent = (iconName) => {
    const icons = {
      'github': Github,
      'linkedin': Linkedin,
      'twitter': Twitter,
      'email': Mail,
      'instagram': Instagram,
      'facebook': Facebook,
      'youtube': Youtube,
      'fab fa-github': Github,
      'fab fa-linkedin': Linkedin,
      'fab fa-twitter': Twitter,
      'fas fa-envelope': Mail,
      'fab fa-instagram': Instagram,
      'fab fa-facebook': Facebook,
      'fab fa-youtube': Youtube,
    };
    
    const Icon = icons[iconName?.toLowerCase()];
    return Icon || Github; // Default to Github icon
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
        ease: "easeOut"
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const currentYear = new Date().getFullYear();

  return (
    <>
      {/* Scroll to Top Button */}
      {showScrollTop && (
        <motion.button
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 bg-gradient-to-r from-blue-500 to-purple-600 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Scroll to top"
        >
          <ArrowUp className="w-5 h-5 group-hover:animate-bounce" />
        </motion.button>
      )}

      <footer 
        ref={footerRef}
        className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 text-white pt-12 pb-6 overflow-hidden"
      >
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-grid-white/10 [mask-image:radial-gradient(ellipse_at_center,white,transparent)]"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-500/5 to-purple-500/5"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={controls}
            className="flex flex-col items-center justify-center space-y-8"
          >
            {/* Footer Content */}
            <motion.div variants={itemVariants} className="text-center max-w-2xl">
              <h3 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-3">
                Let's Connect
              </h3>
              <p className="text-gray-300 text-sm md:text-base">
                Feel free to reach out for collaborations, opportunities, or just a friendly chat!
              </p>
            </motion.div>

            {/* Social Links */}
            <motion.div variants={itemVariants} className="w-full">
              {socials && socials.length > 0 ? (
                <div className="flex justify-center gap-4 md:gap-6 flex-wrap">
                  {socials.map((social, index) => {
                    const IconComponent = getIconComponent(social.icon);
                    return (
                      <motion.a
                        key={social._id || index}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="relative group"
                        whileHover={{ y: -5 }}
                        whileTap={{ scale: 0.95 }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur-md opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                        <div className="relative bg-white/10 backdrop-blur-sm p-3 rounded-full border border-white/20 group-hover:border-blue-400 transition-all duration-300">
                          <IconComponent className="w-5 h-5 md:w-6 md:h-6 text-gray-300 group-hover:text-white transition-colors duration-300" />
                        </div>
                      </motion.a>
                    );
                  })}
                </div>
              ) : (
                // Fallback default social links if backend data not available
                <div className="flex justify-center gap-4 md:gap-6 flex-wrap">
                  {[
                    { icon: Github, url: "#", name: "GitHub" },
                    { icon: Linkedin, url: "#", name: "LinkedIn" },
                    { icon: Twitter, url: "#", name: "Twitter" },
                    { icon: Mail, url: "#", name: "Email" }
                  ].map((social, index) => (
                    <motion.a
                      key={index}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="relative group"
                      whileHover={{ y: -5 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur-md opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                      <div className="relative bg-white/10 backdrop-blur-sm p-3 rounded-full border border-white/20 group-hover:border-blue-400 transition-all duration-300">
                        <social.icon className="w-5 h-5 md:w-6 md:h-6 text-gray-300 group-hover:text-white transition-colors duration-300" />
                      </div>
                    </motion.a>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Divider */}
            <motion.div 
              variants={itemVariants}
              className="w-full max-w-md h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent"
            />

            {/* Copyright and Additional Info */}
            <motion.div variants={itemVariants} className="text-center space-y-3">
              <p className="text-gray-400 text-sm flex items-center justify-center gap-2 flex-wrap">
                <span>© {currentYear} Ahmed Seid.</span>
                <span className="hidden sm:inline">•</span>
                <span>All rights reserved.</span>
                <span className="hidden sm:inline">•</span>
                <span className="flex items-center gap-1">
                  Made with <Heart className="w-3 h-3 text-red-500 fill-red-500 animate-pulse" /> for the community
                </span>
              </p>
              
              {/* Additional Footer Links */}
              <div className="flex justify-center gap-4 text-xs text-gray-500">
                <a href="#" className="hover:text-blue-400 transition-colors">Privacy Policy</a>
                <span>•</span>
                <a href="#" className="hover:text-blue-400 transition-colors">Terms of Service</a>
                <span>•</span>
                <a href="#" className="hover:text-blue-400 transition-colors">Contact</a>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom Gradient Line */}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
      </footer>

      <style jsx>{`
        .bg-grid-white\/10 {
          background-image: url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1' fill-rule='evenodd'%3E%3Cpath d='M0 0h40v40H0z'/%3E%3C/g%3E%3C/svg%3E");
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </>
  );
}