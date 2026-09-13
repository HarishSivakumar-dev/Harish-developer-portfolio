import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Copy, Check, Terminal, Send } from 'lucide-react';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [copied, setCopied] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('harishss.2k07@gmail.com');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setLoading(true);
    setSubmitted(false);
    setError(null);

    try {
      const response = await fetch('http://localhost:8080/api/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message,
        }),
      });

      if (response.ok) {
        setSubmitted(true);
        setFormData({ name: '', email: '', message: '' });
        setTimeout(() => setSubmitted(false), 5000);
      } else {
        const errText = await response.text().catch(() => '');
        setError(errText || `Server Error: HTTP ${response.status}`);
      }
    } catch (err) {
      console.error('Contact submission error:', err);
      setError('Connection failed: Unable to reach backend server at http://localhost:8080');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="contact">
      <div className="container">
        <h2 className="section-title">HANDSHAKE</h2>

        <div className="contact-grid">
          {/* Details column: styled as server stats panel */}
          <motion.div
            className="contact-info-column"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <div className="contact-info-summary">
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>// ESTABLISHING CONNECTION</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.5' }}>
                I am open to backend development internships, freelance pipelines, ECE research, and infrastructure projects. Feel free to compile a transmission query.
              </p>
            </div>

            <div className="contact-card-list">
              <div className="contact-info-card-telemetry">
                <div className="contact-icon-box">
                  <Mail size={16} />
                </div>
                <div className="contact-details">
                  <h4>SMTP_TARGET</h4>
                  <p>
                    harishss.2k07@gmail.com
                    <button onClick={handleCopyEmail} className="copy-btn-cyber" aria-label="Copy email to clipboard">
                      {copied ? <Check size={12} className="text-accent" /> : <Copy size={12} />}
                    </button>
                  </p>
                </div>
                {copied && <span className="copy-tooltip-cyber">Copied!</span>}
              </div>

              <div className="contact-info-card-telemetry">
                <div className="contact-icon-box">
                  <Phone size={16} />
                </div>
                <div className="contact-details">
                  <h4>TELEPHONE_PORT</h4>
                  <p>+91 - 9092418002</p>
                </div>
              </div>

              <div className="contact-info-card-telemetry">
                <div className="contact-icon-box">
                  <MapPin size={16} />
                </div>
                <div className="contact-details">
                  <h4>GEOLOCATION_NODE</h4>
                  <p>Salem, Tamil Nadu, India</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Form column: styled as dynamic CLI payload compiler */}
          <motion.div
            className="contact-form-column"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, margin: "-100px" }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <div className="contact-form-card-cyber">
              {/* Console window header */}
              <div className="form-card-header">
                <div className="header-icon-group">
                  <Terminal size={14} className="text-accent" />
                  <span>payload_compiler.sh</span>
                </div>
                <div className="header-status-dot"></div>
              </div>

              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-group-cyber">
                  <label htmlFor="name"><span className="cli-symbol">stdin &gt;</span> SENDER_NAME</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Enter name..."
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    disabled={loading}
                  />
                </div>

                <div className="form-group-cyber">
                  <label htmlFor="email"><span className="cli-symbol">stdin &gt;</span> SENDER_EMAIL</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Enter email..."
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={loading}
                  />
                </div>

                <div className="form-group-cyber">
                  <label htmlFor="message"><span className="cli-symbol">payload &gt;</span> TRANSMISSION_DATA</label>
                  <textarea
                    id="message"
                    name="message"
                    placeholder="Type transaction log message details..."
                    required
                    rows="4"
                    value={formData.message}
                    onChange={handleInputChange}
                    disabled={loading}
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ width: '100%', marginTop: '0.5rem' }}
                  disabled={loading}
                >
                  {loading ? (
                    "COMPILING PAYLOAD..."
                  ) : (
                    <>
                      TRANSMIT PAYLOAD [SECURE_SSL] <Send size={14} />
                    </>
                  )}
                </button>

                {submitted && (
                  <motion.div
                    className="form-success-msg-cyber"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    STATUS // SUCCESS: Payload transmitted to server
                  </motion.div>
                )}
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
