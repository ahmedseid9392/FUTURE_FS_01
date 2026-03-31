import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { AuthProvider } from "./context/AuthContext";
import AOS from "aos";
import "aos/dist/aos.css";
import { Toaster } from "react-hot-toast";

import LoginModal from "./components/LoginModal";
import Navbar from "./navigation/Navbar";
import ScrollToTop from "./navigation/ScrollToTop";
import Footer from "./navigation/Footer";

import Home from "./pages/Home";
import About from "./pages/About";
import Skills from "./pages/Skills";
import Projects from "./pages/Projects";
import Contact from "./pages/Contact";

import Dashboard from "./admin/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";

// Page transition wrapper component
const PageTransition = ({ children }) => {
  const location = useLocation();
  
  const pageVariants = {
    initial: {
      opacity: 0,
      y: 20,
    },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.3,
      },
    },
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

// Home page with all sections
const HomePage = ({ openLoginModal }) => {
  return (
    <>
      <section id="home" className="scroll-mt-16">
        <Home openLoginModal={openLoginModal} />
      </section>
      <section id="about" className="scroll-mt-16">
        <About />
      </section>
      <section id="skills" className="scroll-mt-16">
        <Skills />
      </section>
      <section id="projects" className="scroll-mt-16">
        <Projects />
      </section>
      <section id="contact" className="scroll-mt-16">
        <Contact />
      </section>
    </>
  );
};

function App() {
  const [showLogin, setShowLogin] = useState(false);
  const [loading, setLoading] = useState(true);

  const openLoginModal = () => setShowLogin(true);
  const closeLoginModal = () => setShowLogin(false);

  useEffect(() => {
    // Initialize AOS
    AOS.init({
      duration: 900,
      once: true,
      offset: 100,
      easing: "ease-in-out",
    });

    // Refresh AOS on window load
    window.addEventListener("load", () => {
      AOS.refresh();
    });

    // Simulate loading (optional)
    setTimeout(() => {
      setLoading(false);
    }, 500);

    return () => {
      window.removeEventListener("load", AOS.refresh);
    };
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center z-50">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white mx-auto mb-4"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-white text-2xl font-bold">A</span>
            </div>
          </div>
          <p className="text-white text-lg mt-4 animate-pulse">Loading portfolio...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthProvider>
     
        <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
          {/* Toaster for notifications */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
                borderRadius: '12px',
              },
              success: {
                style: {
                  background: '#10B981',
                },
                iconTheme: {
                  primary: '#fff',
                  secondary: '#10B981',
                },
              },
              error: {
                style: {
                  background: '#EF4444',
                },
                iconTheme: {
                  primary: '#fff',
                  secondary: '#EF4444',
                },
              },
            }}
          />
          
          {/* Navbar */}
          <Navbar openLoginModal={openLoginModal} />
          
          {/* Main Content */}
          <main className="flex-grow">
            <ScrollToTop />
            <PageTransition>
              <Routes>
                {/* Home with all sections */}
                <Route
                  path="/"
                  element={<HomePage openLoginModal={openLoginModal} />}
                />

                {/* Individual routes */}
                <Route path="/about" element={<About />} />
                <Route path="/skills" element={<Skills />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/contact" element={<Contact />} />

                {/* Admin routes */}
                <Route
                  path="/admin/*"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </PageTransition>
          </main>
          
          {/* Footer */}
          <Footer />
        </div>

        {/* Login Modal */}
        {showLogin && (
          <LoginModal close={closeLoginModal} />
        )}
      
    </AuthProvider>
  );
}

export default App;