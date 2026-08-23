import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, Layers, Award, Zap, Terminal } from 'lucide-react';
import profileImg from '../assets/profile.jpg';
import './About.css';

const About = () => {
  const metrics = [
    {
      icon: <Zap size={16} className="text-accent" />,
      value: "<150ms",
      label: "API Latency",
      desc: "Redis & Kafka pipelines",
      gradient: "text-accent"
    },
    {
      icon: <Layers size={16} className="text-gradient" />,
      value: "10K+",
      label: "Concurrency",
      desc: "Tick-It microservices",
      gradient: "text-gradient"
    },
    {
      icon: <Award size={16} className="text-gradient-secondary" />,
      value: "Best Paper",
      label: "ICAME '26",
      desc: "Supply Chain research",
      gradient: "text-gradient-secondary"
    },
    {
      icon: <Cpu size={16} className="text-accent" />,
      value: "Winner",
      label: "BIT Hacks 2025",
      desc: "Backend Dev champion",
      gradient: "text-accent"
    }
  ];

  return (
    <section id="about" className="about">
      <div className="container">
        <h2 className="section-title">SYS_PROFILE</h2>
        
        <div className="about-grid">
          {/* Left panel: Hardware System Specs & Bio */}
          <motion.div 
            className="spec-sheet-panel"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <div className="panel-header">
              <Terminal size={14} className="panel-icon" />
              <span>spec_sheet.log</span>
            </div>
            
            <div className="panel-body">
              <div className="specs-upper-row">
                {/* Profile Photo Diagnostic Frame */}
                <div className="profile-photo-frame">
                  <img src={profileImg} alt="Harish S S Profile" className="profile-img" />
                  <div className="photo-corner-tag">CAM_01 // SECURE</div>
                  <div className="photo-scanline"></div>
                </div>

                {/* Technical key values */}
                <div className="specs-table">
                  <div className="spec-row">
                    <span className="spec-key">ACADEMIC_NODE:</span>
                    <span className="spec-val">BIT Erode // ECE Undergrad</span>
                  </div>
                  <div className="spec-row">
                    <span className="spec-key">FOCUS_DOMAINS:</span>
                    <span className="spec-val">Backend Eng, Distributed Architectures, DevOps</span>
                  </div>
                  <div className="spec-row">
                    <span className="spec-key">CORE_COMPILER:</span>
                    <span className="spec-val">Java & Spring Boot Ecosystem</span>
                  </div>
                </div>
              </div>

              {/* Bio details */}
              <div className="spec-bio">
                <p>
                  I am an ECE undergraduate at Bannari Amman Institute of Technology, Erode. My academic background fuses hardware-software co-design with a primary passion for engineering highly scalable, secure, and distributed backend systems.
                </p>
                <p>
                  I specialize in Java and Spring Boot microservices architectures, leveraging Apache Kafka for asynchronous stream processing, Redis for high-throughput state caching, and Docker for containerized environments. I focus heavily on latency tuning, endpoint hardening (Spring Security, JWT, RBAC), and automated DevOps builds.
                </p>
                <p>
                  From reverse proxy configs in Nginx to writing state caching layers, I build resilient systems engineered to sustain heavy transaction traffic.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right panel: Telemetry Metrics Grid */}
          <motion.div 
            className="about-metrics"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, margin: "-100px" }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            {metrics.map((metric, index) => (
              <div key={index} className="metric-card-telemetry">
                {/* Visual slot indicator */}
                <div className="metric-header">
                  <div className="slot-indicator">SLOT_0{index + 1}</div>
                  <div className="metric-icon-box">{metric.icon}</div>
                </div>
                
                <div className="metric-value-box">
                  <span className={`metric-value ${metric.gradient}`}>{metric.value}</span>
                </div>
                
                <div className="metric-meta">
                  <div className="metric-label">{metric.label}</div>
                  <div className="metric-desc">{metric.desc}</div>
                </div>

                {/* Status indicator line */}
                <div className="metric-status-bar">
                  <div className="status-fill"></div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
