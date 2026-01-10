import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "./Homepage/Navigation.js";
import HeroSection from "./Homepage/HeroSection.js";
import FeaturesSection from "./Homepage/FeaturesSection.js";
import ProcessSection from "./Homepage/ProcessSection.js";
import CTASection from "./Homepage/CTASection.js";
import Footer from "./Homepage/Footer.js";
import "../../styles/pages/homepage.css";

const Homepage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
    
    if (isLoggedIn) {
      const userId = localStorage.getItem('userId');
      const isAdmin = userId === 'admin@gradingai.com' || userId === 'admin@grading.com';
      
      if (isAdmin) {
        navigate('/multi-accounting-dashboard');
      } else {
        const savedRole = localStorage.getItem('userRole');
        if (savedRole && savedRole !== 'admin') {
          if (savedRole === 'teacher') {
            navigate('/teacher-dashboard');
          } else {
            navigate('/student-dashboard');
          }
        } else {
          if (savedRole === 'admin') {
            localStorage.removeItem('userRole');
          }
          navigate('/role-selector');
        }
      }
    }
  }, [navigate]);

  const handleGetStarted = () => {
    navigate("/login");
  };

  return (
    <div className="homepage-new">
      <Navigation />
      <HeroSection />
      <FeaturesSection />
      <ProcessSection />
      <CTASection onGetStarted={handleGetStarted} />
      <Footer />
    </div>
  );
};

export default Homepage;
