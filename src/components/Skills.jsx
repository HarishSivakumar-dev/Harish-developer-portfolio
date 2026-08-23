import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SkillCloud3D from './SkillCloud3D';
import './Skills.css';

const SKILLS_DATA = {
  languages: [
    { name: "Java", level: "95%", desc: "Core & Advanced, multithreading, OOP" },
    { name: "SQL", level: "90%", desc: "Complex queries, join structures, optimizations" },
    { name: "Python", level: "85%", desc: "Automation scripting, Spring AI hookups" },
    { name: "HTML & CSS", level: "85%", desc: "Layout designs, responsive design, animations" }
  ],
  frameworks: [
    { name: "Spring Boot", level: "95%", desc: "Standalone & microservices architecture setup" },
    { name: "Spring MVC", level: "90%", desc: "RESTful API creation & MVC paradigms" },
    { name: "Spring Security", level: "90%", desc: "JWTs, RBAC policies, CSRF protections" },
    { name: "Spring Data JPA", level: "90%", desc: "Hibernate mapping, transaction management" },
    { name: "Apache Kafka", level: "85%", desc: "Asynchronous stream pipeline processing" },
    { name: "Spring AI", level: "80%", desc: "LLM completions and agent integrations" }
  ],
  devops: [
    { name: "Docker", level: "90%", desc: "Container creation, networking, Docker Compose" },
    { name: "Redis", level: "85%", desc: "Memory cache clustering, token management" },
    { name: "Nginx", level: "80%", desc: "Reverse proxies, routing, server block headers" },
    { name: "AWS EC2", level: "75%", desc: "Instance provisioning, security groups, basic scaling" },
    { name: "OpenSSH", level: "75%", desc: "Remote management, tunneling, SSH key security" }
  ],
  tools: [
    { name: "Postman", level: "90%", desc: "API endpoint testing, automation collections" },
    { name: "Git & GitHub", level: "90%", desc: "Branching policies, version control, actions" },
    { name: "Spring Tool Suite", level: "90%", desc: "Primary IDE environment for Java applications" },
    { name: "MySQL Workbench", level: "85%", desc: "Schema design, visual modeling, diagnostic tools" }
  ]
};

const TABS = [
  { id: 'languages', name: '/dev/sda1_languages' },
  { id: 'frameworks', name: '/dev/sda2_frameworks' },
  { id: 'devops', name: '/dev/sda3_devops_infra' },
  { id: 'tools', name: '/dev/sda4_tools' }
];

const Skills = () => {
  const [activeTab, setActiveTab] = useState('languages');

  return (
    <section id="skills" className="skills">
      <div className="container skills-container">
        <h2 className="section-title">TELEMETRY</h2>

        <div className="skills-layout">
          <div className="skills-left">
            {/* System Partitions tabs */}
            <div className="skills-tabs">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  className={`skill-tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <span className="partition-indicator">[ PARTITION ]</span> {tab.name}
                </button>
              ))}
            </div>

            <div style={{ width: '100%', minHeight: '320px' }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  className="skills-grid"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.25 }}
                >
                  {SKILLS_DATA[activeTab].map((skill, index) => (
                    <div key={index} className="skill-card-telemetry">
                      <div className="skill-meta-header">
                        <span className="skill-status-tag">ALLOCATED_IO</span>
                        <span className="skill-level-pct">{skill.level}</span>
                      </div>
                      
                      <div className="skill-main-row">
                        <span className="skill-process-name">{skill.name}</span>
                      </div>

                      {/* Diagnostic Allocation Bar */}
                      <div className="skill-allocation-bar">
                        <div className="allocation-rail">
                          <motion.div 
                            className="allocation-bar-fill" 
                            initial={{ width: 0 }}
                            animate={{ width: skill.level }}
                            transition={{ duration: 0.8, delay: index * 0.05 }}
                          />
                        </div>
                      </div>

                      <p className="skill-process-desc">
                        {skill.desc}
                      </p>
                    </div>
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Telemetry frame for 3D tag cloud */}
          <div className="skills-right">
            <div className="cloud-frame-header">NODE_TAGS // SECTOR_3D</div>
            <div className="cloud-body-wrapper">
              <SkillCloud3D activeCategory={activeTab} />
            </div>
            <div className="cloud-frame-footer">SECTOR: ACTIVE // SCALE: AUTO</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;
