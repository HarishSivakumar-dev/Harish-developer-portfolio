import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Mail, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { NetworkBackgroundCanvas } from './Network3D';
import './Hero.css';

const Github = ({ size = 18, className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const Linkedin = ({ size = 18, className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const ROLES = ["SYSTEMS_DEVELOPER", "DEVOPS_ENGINEER", "BACKEND_ARCHITECT", "DISTRIBUTED_DESIGNER"];

const VariableText = ({ text }) => {
  const titleRef = useRef(null);
  const lettersRef = useRef([]);
  const mousePos = useRef({ x: 0, y: 0 });
  const smoothedMouse = useRef({ x: 0, y: 0 });
  const letterCenters = useRef([]);
  const titleWidthRef = useRef(600);

  const chars = useMemo(() => text.split(""), [text]);

  const updateCenters = useCallback(() => {
    if (titleRef.current) {
      const rect = titleRef.current.getBoundingClientRect();
      titleWidthRef.current = rect.width;
      
      letterCenters.current = lettersRef.current.map((el) => {
        if (!el) return null;
        const letterRect = el.getBoundingClientRect();
        return {
          x: letterRect.left + letterRect.width / 2,
          y: letterRect.top + letterRect.height / 2
        };
      });
    }
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      mousePos.current.x = e.clientX;
      mousePos.current.y = e.clientY;
    };
    
    const handleTouchMove = (e) => {
      if (e.touches.length > 0) {
        mousePos.current.x = e.touches[0].clientX;
        mousePos.current.y = e.touches[0].clientY;
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });

    // Initialize position to center of screen
    smoothedMouse.current.x = window.innerWidth / 2;
    smoothedMouse.current.y = window.innerHeight / 2;
    mousePos.current.x = smoothedMouse.current.x;
    mousePos.current.y = smoothedMouse.current.y;

    // Recalculate centers on resize or scroll
    const handleLayoutChange = () => {
      requestAnimationFrame(updateCenters);
    };
    window.addEventListener("resize", handleLayoutChange, { passive: true });
    window.addEventListener("scroll", handleLayoutChange, { passive: true });

    // Initial calculation
    const timer = setTimeout(updateCenters, 150);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("resize", handleLayoutChange);
      window.removeEventListener("scroll", handleLayoutChange);
      clearTimeout(timer);
    };
  }, [updateCenters]);

  useEffect(() => {
    let animId;
    const tick = () => {
      // Smooth trailing interpolation
      smoothedMouse.current.x += (mousePos.current.x - smoothedMouse.current.x) * 0.08;
      smoothedMouse.current.y += (mousePos.current.y - smoothedMouse.current.y) * 0.08;

      if (letterCenters.current.length > 0) {
        const radius = titleWidthRef.current / 2.2 || 300;

        lettersRef.current.forEach((el, idx) => {
          if (!el) return;
          const center = letterCenters.current[idx];
          if (!center) return;

          const dx = center.x - smoothedMouse.current.x;
          const dy = center.y - smoothedMouse.current.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          const ratio = Math.max(0, 1 - dist / radius);
          const smoothRatio = Math.sin(ratio * Math.PI / 2); // Smooth ease curve

          const weight = Math.floor(100 + smoothRatio * 850); // 100 to 950
          const width = Math.floor(30 + smoothRatio * 121);   // 30 to 151

          const val = `'wght' ${weight}, 'wdth' ${width}, 'ital' 0`;
          if (el.style.fontVariationSettings !== val) {
            el.style.fontVariationSettings = val;
          }
        });
      }

      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <h1 ref={titleRef} className="hero-title-interactive">
      {chars.map((char, idx) => (
        <span
          key={idx}
          ref={(el) => (lettersRef.current[idx] = el)}
          className="variable-letter"
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </h1>
  );
};

const Hero = () => {
  const [roleIdx, setRoleIdx] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(150);

  useEffect(() => {
    const handleTyping = () => {
      const fullText = ROLES[roleIdx];

      if (!isDeleting) {
        setDisplayText(fullText.substring(0, displayText.length + 1));
        setTypingSpeed(100);

        if (displayText === fullText) {
          setIsDeleting(true);
          setTypingSpeed(1500); // pause at the end
        }
      } else {
        setDisplayText(fullText.substring(0, displayText.length - 1));
        setTypingSpeed(50);

        if (displayText === '') {
          setIsDeleting(false);
          setRoleIdx((prev) => (prev + 1) % ROLES.length);
          setTypingSpeed(500); // pause before starting next
        }
      }
    };

    const timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [displayText, isDeleting, roleIdx, typingSpeed]);

  return (
    <section id="home" className="hero">
      {/* 3D background connection nodes canvas floating behind terminal card */}
      <NetworkBackgroundCanvas />

      <div className="container hero-centered-container">
        <motion.div
          className="hero-content-centered"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Cyber Terminal Emulator Shell */}
          <div className="console-terminal">
            {/* Terminal Window Header */}
            <div className="terminal-header">
              <div className="terminal-dots">
                <span className="dot dot-red"></span>
                <span className="dot dot-yellow"></span>
                <span className="dot dot-green"></span>
              </div>
              <div className="terminal-title">session // harish@sys-deck:~</div>
              <div className="terminal-lang">json</div>
            </div>

            {/* Terminal Body */}
            <div className="terminal-body">
              {/* Boot diagnostics */}
              <div className="terminal-diagnostics">
                <p><span className="status-label text-accent">[ OK ]</span> SYSTEM_CORE initialized successfully</p>
                <p><span className="status-label text-accent">[ OK ]</span> PORT_FORWARDING maps active on node 5173</p>
                <p className="prompt-row">harish@sys-deck:~$ fetch --developer-profile</p>
              </div>

              {/* Identity Section */}
              <div className="terminal-profile">
                <span className="profile-greeting">MODULE // 01 // SYS_INIT</span>

                <VariableText text="HARISH S S" />

                <div className="hero-subtitle">
                  <span>role_type &gt; </span>
                  <span className="text-gradient-accent">{displayText}</span>
                  <span className="cursor-prompt">_</span>
                </div>

                <p className="hero-desc">
                  Electronics & Communication Engineering undergraduate specializing in backend architecture, microservices, application security, and DevOps pipelines. I design, secure, and scale high-throughput infrastructure.
                </p>
              </div>

              {/* Terminal Footer Inputs */}
              <div className="terminal-actions-prompt">
                <p className="prompt-row">harish@sys-deck:~$ run portfolio-actions --now</p>

                <div className="hero-actions">
                  <a href="#projects" className="btn btn-primary">
                    Open Projects <ArrowRight size={14} />
                  </a>
                  <a href="#contact" className="btn btn-secondary">
                    Secure Handshake
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Social connections panel */}
          <div className="terminal-ports-row">
            <span className="port-label">PORTS_OPEN //</span>
            <div className="hero-socials">
              <a href="https://github.com/HarishSivakumar-dev" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="GitHub Profile">
                <Github /> <span className="icon-name">PORT_22_SSH</span>
              </a>
              <a href="https://linkedin.com/in/harishsivakumar07" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="LinkedIn Profile">
                <Linkedin /> <span className="icon-name">PORT_443_SSL</span>
              </a>
              <a href="mailto:harishss.2k07@gmail.com" className="social-icon" aria-label="Send Email">
                <Mail size={18} /> <span className="icon-name">PORT_25_SMTP</span>
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
