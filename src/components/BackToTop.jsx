import React, { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './BackToTop.css';

export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      // Show button when user scrolls down 300px
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility, { passive: true });
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          className="back-to-top-btn"
          onClick={scrollToTop}
          initial={{ opacity: 0, y: 20, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 15, scale: 0.8 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          aria-label="Scroll back to top"
        >
          {/* Cyber decoration lines */}
          <div className="btn-decor decor-top"></div>
          <div className="btn-decor decor-bottom"></div>
          
          <div className="btn-content">
            <ChevronUp size={18} className="btn-icon" />
            <span className="btn-label">SYS_UP</span>
          </div>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
