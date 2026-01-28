import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import LandingLoader from '../components/LandingLoader';
import LandingPage from '../pages/LandingPage';

const LandingPageWithLoader = () => {
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    // Check if loader has been shown before
    const loaderShown = localStorage.getItem('landingPageLoaderShown');
    
    // Only show loader if coming from root path (direct access) and hasn't been shown before
    if (location.state?.fromNavbar || loaderShown) {
      setIsLoading(false);
    } else {
      // Show loader for first direct access only
      const timer = setTimeout(() => {
        setIsLoading(false);
        // Mark that loader has been shown
        localStorage.setItem('landingPageLoaderShown', 'true');
      }, 4500); // Match loader duration
      return () => clearTimeout(timer);
    }
  }, [location]);

  if (isLoading) {
    return <LandingLoader onLoadingComplete={() => setIsLoading(false)} />;
  }

  return <LandingPage />;
};

export default LandingPageWithLoader;
