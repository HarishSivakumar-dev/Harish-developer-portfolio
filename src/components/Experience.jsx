import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Award, BookOpen, Shield, Briefcase } from 'lucide-react';
import './Experience.css';

const EXPERIENCE = [
  {
    hash: "df89a1c",
    period: "July 2026 - Present",
    title: "Freelance Software Developer",
    company: "Self-Employed",
    desc: "Designing and developing robust Java/Spring Boot microservices, high-performance web applications, and database architectures for clients globally."
  }
];

const EDUCATION = [
  {
    hash: "edu-b7a",
    period: "2024 - 2028 (Expected)",
    title: "Bachelor of Engineering in Electronics & Communication Engineering",
    institution: "Bannari Amman Institute of Technology, Erode",
    desc: "CGPA: 7.73. Fusing hardware design paradigms with application-level distributed system development."
  },
  {
    hash: "edu-c4d",
    period: "June 2024",
    title: "Higher Secondary (Class XII)",
    institution: "Holy Cross Matriculation Higher Secondary School, Salem",
    desc: "Grade: 91.3% overall with a perfect score of 100/100 in Computer Science."
  },
  {
    hash: "edu-e8f",
    period: "June 2022",
    title: "Secondary School (Class X)",
    institution: "Holy Cross Matriculation Higher Secondary School, Salem",
    desc: "Grade: 93.6% overall with 99/100 in Science."
  }
];

const ACHIEVEMENTS = [
  {
    title: "Best Paper Award — ICAME '26",
    subtitle: "Research Publication",
    desc: "Authored and won the Best Paper Award for exploring 'Cloud-Based ERP Systems in Manufacturing & Supply Chain Networks'."
  },
  {
    title: "Winner (Backend Development) — BIT Hacks 2025",
    subtitle: "Hackathon Champion",
    desc: "Secured 1st place in the App Development domain for Season 2, showcasing Spring Boot API design, caching, and infrastructure."
  },
  {
    title: "Special Mention Award",
    subtitle: "Frontend Competition",
    desc: "Received special recognition in a club-sponsored Frontend Development tournament, demonstrating creative UI layouts."
  },
  {
    title: "Qualified Level-1 — TN SKILLS 2025",
    subtitle: "State Skill Tournament",
    desc: "Successfully advanced past the initial testing bracket representing the Web Development domain."
  }
];

const CERTIFICATIONS = [
  { title: "Java Programming Concepts", issuer: "Livewire (ID: CO240408Z1061930)" },
  { title: "OCI Foundations Associate", issuer: "Oracle Cloud Infrastructure" },
  { title: "ERP Review Publication", issuer: "ICAME '26 Proceedings" }
];

const Experience = () => {
  return (
    <section id="experience" className="experience">
      <div className="container">
        <h2 className="section-title">CHANGELOG</h2>

        <div className="exp-grid">
          {/* Experience & Education column */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="exp-section-subtitle">
              <Briefcase className="text-accent" size={18} /> DEPLOY_CHRONOLOGY
            </h3>
            
            <div className="timeline-cyber" style={{ marginBottom: '2rem' }}>
              {EXPERIENCE.map((exp, idx) => (
                <div key={idx} className="timeline-item-cyber">
                  <div className="timeline-dot-cyber" />
                  <div className="timeline-card-cyber">
                    <div className="commit-header">
                      <span className="commit-hash">COMMIT // {exp.hash}</span>
                      <span className="commit-status">[ DEPLOYED ]</span>
                    </div>
                    <div className="time-period">{exp.period}</div>
                    <h4>{exp.title}</h4>
                    <div className="institution">{exp.company}</div>
                    <p className="timeline-desc">{exp.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <h3 className="exp-section-subtitle">
              <GraduationCap className="text-accent" size={18} /> BUILD_HISTORY
            </h3>
            
            <div className="timeline-cyber">
              {EDUCATION.map((edu, idx) => (
                <div key={idx} className="timeline-item-cyber">
                  <div className="timeline-dot-cyber" />
                  <div className="timeline-card-cyber">
                    <div className="commit-header">
                      <span className="commit-hash">COMMIT // {edu.hash}</span>
                      <span className="commit-status">[ ARCHIVED ]</span>
                    </div>
                    <div className="time-period">{edu.period}</div>
                    <h4>{edu.title}</h4>
                    <div className="institution">{edu.institution}</div>
                    <p className="timeline-desc">{edu.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Achievements column */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="exp-section-subtitle">
              <Award className="text-accent" size={18} /> DIAGNOSTIC_AWARDS
            </h3>

            <div className="awards-list-cyber">
              {ACHIEVEMENTS.map((ach, idx) => (
                <div key={idx} className="award-item-cyber">
                  <div className="award-icon-box">
                    <Shield size={16} />
                  </div>
                  <div className="award-details">
                    <h4>{ach.title}</h4>
                    <p className="award-badge-meta">{ach.subtitle}</p>
                    <p className="award-desc">{ach.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Certifications section */}
            <div className="certs-section-cyber">
              <h3 className="exp-section-subtitle" style={{ fontSize: '1.1rem' }}>
                <BookOpen className="text-accent" size={16} /> CREDENTIALS_STORE
              </h3>
              
              <div className="certs-grid-cyber">
                {CERTIFICATIONS.map((cert, idx) => (
                  <div key={idx} className="cert-card-cyber">
                    <div className="cert-card-header">KEY_0{idx + 1} // CA</div>
                    <div className="cert-title">{cert.title}</div>
                    <div className="cert-issuer">{cert.issuer}</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
