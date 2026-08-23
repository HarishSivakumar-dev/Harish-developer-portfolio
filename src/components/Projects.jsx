import React from 'react';
import { motion } from 'framer-motion';
import ArchDiagram3D from './ArchDiagram3D';
import './Projects.css';

const PROJECTS = [
  {
    title: "Tick-It - Ticketing & Project Management",
    period: "Mar 2026 - Present",
    roles: ["Backend Developer", "DevOps", "Database Architect"],
    stats: [
      { value: "<150ms", label: "Latency" },
      { value: "10K+", label: "Users Support" },
      { value: "+50%", label: "Throughput" }
    ],
    bullets: [
      "Built a Spring Boot microservices ticketing system with WebSockets for real-time updates and custom rate limiting.",
      "Implemented secure gateway routing (Nginx + API Gateway) featuring JWT validation and Role-Based Access Control.",
      "Leveraged Apache Kafka event stream and Redis state caching to optimize transaction latencies down to <150ms."
    ],
    tech: ["Spring Boot", "Spring MVC", "Spring Security", "Apache Kafka", "Redis", "Nginx", "Docker", "WebSockets"],
    visualType: "microservices",
    containerId: "TICK-IT",
    port: "8080"
  },
  {
    title: "SkillSprint - Learning & Certification Engine",
    period: "Aug 2025 - Jan 2026",
    roles: ["Backend Developer", "DevOps", "Database Architect"],
    stats: [
      { value: "<200ms", label: "Response" },
      { value: "5K+", label: "Concurrent Users" },
      { value: ">90%", label: "Uptime" }
    ],
    bullets: [
      "Designed a robust Spring Boot monolithic backend for skill certification, quiz tracking, and leaderboard scores.",
      "Hardened authorization layers with JWT, refresh token rotation, cross-site scripting (CSRF) shields, and RBAC.",
      "Optimized database persistence mapping (Spring Data JPA / Hibernate) to handle over 100k daily transactions with >90% uptime."
    ],
    tech: ["Spring Boot", "Spring Data JPA", "Spring Security", "Redis", "MySQL", "JWT Security", "CSRF Protection"],
    visualType: "monolith",
    containerId: "SKILL-SPRINT",
    port: "8081"
  }
];

const ArchitectureDiagram = ({ type }) => {
  return (
    <div className="project-visual-frame" style={{ padding: 0, overflow: 'hidden' }}>
      <div className="visual-header">TELEMETRY_STREAM // {type.toUpperCase()}_ARCH</div>
      <div className="visual-body">
        <ArchDiagram3D type={type} />
      </div>
      <div className="visual-footer">OK // RENDERED: 3D_CANVAS</div>
    </div>
  );
};

const Projects = () => {
  return (
    <section id="projects" className="projects">
      <div className="container">
        <h2 className="section-title">CONTAINERS</h2>
        
        <div className="projects-list">
          {PROJECTS.map((proj, idx) => (
            <motion.div 
              key={idx} 
              className="project-card-cyber"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, margin: "-100px" }}
              transition={{ duration: 0.7, delay: idx * 0.1 }}
            >
              {/* Card Meta Header */}
              <div className="project-meta-bar">
                <div className="meta-left">
                  <span className="status-indicator-ping"></span>
                  <span className="meta-tag">CONTAINER_ID:</span>
                  <span className="meta-val text-gradient-accent">{proj.containerId}</span>
                </div>
                <div className="meta-right">
                  <span className="meta-tag">PORT:</span>
                  <span className="meta-val">{proj.port}</span>
                </div>
              </div>

              <div className="project-card-body">
                <div className="project-info">
                  <div className="project-period">{proj.period}</div>
                  <h3 className="project-title">{proj.title}</h3>
                  
                  <div className="project-roles">
                    {proj.roles.map((role, rid) => (
                      <span key={rid} className="role-tag">{role}</span>
                    ))}
                  </div>

                  <div className="project-stats">
                    {proj.stats.map((st, sid) => (
                      <div key={sid} className="p-stat-cyber">
                        <div className="p-stat-val">{st.value}</div>
                        <div className="p-stat-lbl">{st.label}</div>
                      </div>
                    ))}
                  </div>

                  <ul className="project-bullets">
                    {proj.bullets.map((bull, bid) => (
                      <li key={bid}>{bull}</li>
                    ))}
                  </ul>

                  <div className="project-tech">
                    {proj.tech.map((t, tid) => (
                      <span key={tid} className="badge">{t}</span>
                    ))}
                  </div>
                </div>

                <div className="project-graphic">
                  <ArchitectureDiagram type={proj.visualType} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
