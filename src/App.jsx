import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Experience from './components/Experience';
import Contact from './components/Contact';
import Background3D from './components/Background3D';
import Chatbot from './components/Chatbot';
import BackToTop from './components/BackToTop';
import './App.css';

const LoadingScreen = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [logIndex, setLogIndex] = useState(0);
  const logs = [
    "INIT SYSTEM // harish-core-v1.0.4",
    "LOADING KERNEL MODULES & SCHEMAS...",
    "MOUNTING STORAGE PARTITIONS [/dev/sda1]...",
    "INITIALIZING THREE.JS TELEMETRY VIEWPORTS...",
    "ESTABLISHING SECURE PORT HOOKS...",
    "COMPILING ACTIVE SERVICE CONTAINER REPOSITORIES...",
    "SYSTEM SECURE. BOOT COMPLETE."
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(onComplete, 450);
          return 100;
        }
        return prev + 1;
      });
    }, 18); // 1.8 seconds linear progression

    return () => clearInterval(timer);
  }, [onComplete]);

  useEffect(() => {
    const step = 100 / logs.length;
    const currentIdx = Math.min(Math.floor(progress / step), logs.length - 1);
    if (currentIdx > logIndex) {
      setLogIndex(currentIdx);
    }
  }, [progress, logIndex]);

  return (
    <motion.div 
      className="boot-loader-screen"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      <div className="boot-loader-box">
        <div className="boot-header">
          <span className="boot-tag">SYSTEM INIT</span>
          <span className="boot-pct">{progress}%</span>
        </div>
        
        <div className="boot-logs">
          {logs.slice(0, logIndex + 1).map((log, i) => (
            <div key={i} className="boot-log-row">
              <span className="boot-status">[ OK ]</span>
              <span className="boot-text">{log}</span>
            </div>
          ))}
          {progress < 100 && (
            <div className="boot-log-row active-log">
              <span className="boot-status blink">[ .. ]</span>
              <span className="boot-text">PROCESSING PAYLOAD_BUFFER...</span>
            </div>
          )}
        </div>

        <div className="boot-bar">
          <div className="boot-fill" style={{ width: `${progress}%` }}></div>
        </div>
      </div>
    </motion.div>
  );
};

function App() {
  const [loadingComplete, setLoadingComplete] = useState(false);
  const cursorRef = useRef();
  const glowRef = useRef();
  const mouse = useRef({ x: -1000, y: -1000 });
  const cursorPos = useRef({ x: -1000, y: -1000 });
  const sticky = useRef(null);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    };

    const handleMouseOver = (e) => {
      const target = e.target;
      if (!target) return;

      // Snaps to magnetic targets on mouseover rather than inside mousemove loops (prevents forced layout thrashing)
      const interactiveEl = target.closest('a, button, .social-icon, .navbar-link, .skill-tab-btn, .suggestion-pill');
      if (interactiveEl) {
        const rect = interactiveEl.getBoundingClientRect();
        sticky.current = {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
          width: rect.width + 12,
          height: rect.height + 12,
          borderRadius: window.getComputedStyle(interactiveEl).borderRadius
        };
        if (cursorRef.current) {
          cursorRef.current.classList.add('zoom', 'sticky');
        }
      } else {
        sticky.current = null;
        if (cursorRef.current) {
          cursorRef.current.classList.remove('sticky');
        }
        
        const generalHover = 
          target.closest('.skill-card-telemetry') || 
          target.closest('.project-card-cyber') || 
          target.closest('.metric-card-telemetry') ||
          target.closest('.timeline-card-cyber') ||
          target.closest('.award-item-cyber') ||
          target.closest('.variable-letter') ||
          target.closest('.hero-title-interactive') ||
          target.closest('input') ||
          target.closest('textarea');
        if (generalHover) {
          if (cursorRef.current) cursorRef.current.classList.add('zoom');
        } else {
          if (cursorRef.current) cursorRef.current.classList.remove('zoom');
        }
      }
    };

    const handleMouseEnter = () => {
      if (cursorRef.current) cursorRef.current.classList.remove('hidden');
    };
    const handleMouseLeave = () => {
      if (cursorRef.current) cursorRef.current.classList.add('hidden');
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseover', handleMouseOver, { passive: true });
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);

    // Butter smooth hardware accelerated rendering frame loop
    let animId;
    const tick = () => {
      // Linear interpolation (lerp) trailing physics
      cursorPos.current.x += (mouse.current.x - cursorPos.current.x) * 0.16;
      cursorPos.current.y += (mouse.current.y - cursorPos.current.y) * 0.16;

      const targetX = sticky.current ? sticky.current.x : cursorPos.current.x;
      const targetY = sticky.current ? sticky.current.y : cursorPos.current.y;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(-50%, -50%) translate3d(${targetX}px, ${targetY}px, 0)`;
        
        if (sticky.current) {
          cursorRef.current.style.width = `${sticky.current.width}px`;
          cursorRef.current.style.height = `${sticky.current.height}px`;
          cursorRef.current.style.borderRadius = sticky.current.borderRadius;
        } else {
          cursorRef.current.style.width = '';
          cursorRef.current.style.height = '';
          cursorRef.current.style.borderRadius = '';
        }
      }

      if (glowRef.current) {
        glowRef.current.style.transform = `translate(-50%, -50%) translate3d(${mouse.current.x}px, ${mouse.current.y}px, 0)`;
      }

      animId = requestAnimationFrame(tick);
    };
    animId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animId);
    };
  }, []);

  // Set up IntersectionObserver to detect currently snapped section
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-40% 0px -40% 0px', // trigger when section covers viewport center
      threshold: 0
    };

    const handleIntersection = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id.replace('section-', '');
          setActiveSection(id);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, observerOptions);
    document.querySelectorAll('.section-wrapper').forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* System Boot Loader Overlay */}
      <AnimatePresence>
        {!loadingComplete && (
          <LoadingScreen onComplete={() => setLoadingComplete(true)} />
        )}
      </AnimatePresence>

      {/* 3D Particle Background Canvas */}
      <Background3D />

      {/* GPU Accelerated Magnetic Custom Cursor Overlay */}
      <div ref={cursorRef} className="custom-cursor" />

      {/* Interactive mouse follow glow overlay */}
      <div ref={glowRef} className="mouse-glow" />
      
      <Navbar />

      {/* Snap Section Content Wrappers */}
      <div id="section-home" className={`section-wrapper ${activeSection === 'home' ? 'active-section' : ''}`}>
        <Hero />
      </div>

      <div id="section-about" className={`section-wrapper ${activeSection === 'about' ? 'active-section' : ''}`}>
        <About />
      </div>

      <div id="section-skills" className={`section-wrapper ${activeSection === 'skills' ? 'active-section' : ''}`}>
        <Skills />
      </div>

      <div id="section-projects" className={`section-wrapper ${activeSection === 'projects' ? 'active-section' : ''}`}>
        <Projects />
      </div>

      <div id="section-experience" className={`section-wrapper ${activeSection === 'experience' ? 'active-section' : ''}`}>
        <Experience />
      </div>

      <div id="section-contact" className={`section-wrapper ${activeSection === 'contact' ? 'active-section' : ''}`}>
        <Contact />
      </div>
      
      {/* Floating AI Chatbot Assistant */}
      <Chatbot />

      {/* Floating Back to Top Button */}
      <BackToTop />

      <footer className="footer">
        <div className="container footer-content">
          <a href="#home" className="footer-logo">
            Harish<span style={{ color: 'var(--accent)' }}>.dev</span>
          </a>
          <p className="footer-text">
            © 2026 Harish S S. All rights reserved. Created with React & Three.js.
          </p>
          <div className="footer-links">
            <a href="https://github.com/HarishSivakumar-dev" target="_blank" rel="noopener noreferrer" className="footer-link">GitHub</a>
            <a href="https://linkedin.com/in/harishsivakumar07" target="_blank" rel="noopener noreferrer" className="footer-link">LinkedIn</a>
            <a href="mailto:harishss.2k07@gmail.com" className="footer-link">Email</a>
          </div>
        </div>
      </footer>
    </>
  );
}

export default App;
